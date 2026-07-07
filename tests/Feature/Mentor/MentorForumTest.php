<?php

namespace Tests\Feature\Mentor;

use App\Models\Course;
use App\Models\ForumMessage;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MentorForumTest extends TestCase
{
    protected $course;

    protected $mentor;

    protected $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);

        // Buat data course dummy
        $this->course = Course::create([
            'title' => 'Mentor Testing Course',
            'slug' => 'mentor-testing-course-'.uniqid(),
            'description' => 'A course for testing mentor forum actions',
            'status' => 'draft', // Mentor can see drafts too!
            'is_active' => false, // Mentor can see inactive too!
        ]);

        // Mentor
        $this->mentor = User::create([
            'name' => 'Mentor John',
            'email' => 'mentor_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'mentor',
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
        if ($this->mentor) {
            $this->mentor->delete();
        }
        if ($this->otherUser) {
            $this->otherUser->delete();
        }

        parent::tearDown();
    }

    public function test_guests_are_redirected_to_the_login_page_from_mentor_forum(): void
    {
        $response = $this->get('/mentor/forum');
        $response->assertRedirect(route('login'));
    }

    public function test_mentor_can_access_mentor_forum_and_view_all_courses(): void
    {
        $this->actingAs($this->mentor);

        $response = $this->get('/mentor/forum/'.$this->course->slug);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Mentor/Forum/Index')
            ->has('courses')
            ->has('selectedCourse')
            ->has('messages')
            ->where('selectedCourse.id', $this->course->_id)
        );
    }

    public function test_mentor_can_send_message_to_the_forum(): void
    {
        $this->actingAs($this->mentor);

        $response = $this->post('/mentor/forum/'.$this->course->slug.'/messages', [
            'message' => 'Hello from Mentor!',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('forum_messages', [
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Hello from Mentor!',
        ], 'mongodb');
    }

    public function test_mentor_can_edit_their_own_message(): void
    {
        $this->actingAs($this->mentor);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Initial message by Mentor',
        ]);

        $response = $this->put('/mentor/forum/messages/'.$msg->_id, [
            'message' => 'Updated message by Mentor',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Updated message by Mentor', $msg->fresh()->message);
    }

    public function test_mentor_can_delete_any_message(): void
    {
        $this->actingAs($this->mentor);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->otherUser->_id,
            'message' => 'A message by student to be deleted by Mentor',
        ]);

        $response = $this->delete('/mentor/forum/messages/'.$msg->_id);

        $response->assertRedirect();
        $this->assertNull(ForumMessage::find($msg->_id));
    }

    public function test_mentor_can_pin_message(): void
    {
        $this->actingAs($this->mentor);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->otherUser->_id,
            'message' => 'Pin this message',
            'is_pinned' => false,
        ]);

        $response = $this->post('/mentor/forum/messages/'.$msg->_id.'/pin');

        $response->assertRedirect();
        $this->assertTrue((bool) $msg->fresh()->is_pinned);
    }
}
