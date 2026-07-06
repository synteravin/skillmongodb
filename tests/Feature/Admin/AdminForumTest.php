<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use App\Models\ForumMessage;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminForumTest extends TestCase
{
    protected $course;

    protected $admin;

    protected $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);

        // Buat data course dummy
        $this->course = Course::create([
            'title' => 'Admin Testing Course',
            'slug' => 'admin-testing-course-'.uniqid(),
            'description' => 'A course for testing admin forum actions',
            'status' => 'draft', // Admin can see drafts too!
            'is_active' => false, // Admin can see inactive too!
        ]);

        // Admin
        $this->admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Student
        $this->otherUser = User::create([
            'name' => 'Regular Student',
            'email' => 'student_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);
    }

    protected function tearDown(): void
    {
        if ($this->course) {
            ForumMessage::where('course_id', $this->course->_id)->delete();
            $this->course->delete();
        }
        if ($this->admin) {
            $this->admin->delete();
        }
        if ($this->otherUser) {
            $this->otherUser->delete();
        }

        parent::tearDown();
    }

    public function test_guests_are_redirected_to_the_login_page_from_admin_forum(): void
    {
        $response = $this->get('/admin/forum');
        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_access_admin_forum_and_view_all_courses(): void
    {
        $this->actingAs($this->admin);

        $response = $this->get('/admin/forum/'.$this->course->slug);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Forum/Index')
            ->has('courses')
            ->has('selectedCourse')
            ->has('messages')
            ->where('selectedCourse.id', $this->course->_id)
        );
    }

    public function test_admin_can_send_message_to_the_forum(): void
    {
        $this->actingAs($this->admin);

        $response = $this->post('/admin/forum/'.$this->course->slug.'/messages', [
            'message' => 'Hello from Admin!',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('forum_messages', [
            'course_id' => $this->course->_id,
            'user_id' => $this->admin->_id,
            'message' => 'Hello from Admin!',
        ], 'mongodb');
    }

    public function test_admin_can_edit_their_own_message(): void
    {
        $this->actingAs($this->admin);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->admin->_id,
            'message' => 'Initial message by Admin',
        ]);

        $response = $this->put('/admin/forum/messages/'.$msg->_id, [
            'message' => 'Updated message by Admin',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Updated message by Admin', $msg->fresh()->message);
    }

    public function test_admin_can_delete_any_message(): void
    {
        $this->actingAs($this->admin);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->otherUser->_id,
            'message' => 'A message by student to be deleted by Admin',
        ]);

        $response = $this->delete('/admin/forum/messages/'.$msg->_id);

        $response->assertRedirect();
        $this->assertNull(ForumMessage::find($msg->_id));
    }

    public function test_admin_can_pin_message(): void
    {
        $this->actingAs($this->admin);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->otherUser->_id,
            'message' => 'Pin this message',
            'is_pinned' => false,
        ]);

        $response = $this->post('/admin/forum/messages/'.$msg->_id.'/pin');

        $response->assertRedirect();
        $this->assertTrue((bool) $msg->fresh()->is_pinned);
    }
}
