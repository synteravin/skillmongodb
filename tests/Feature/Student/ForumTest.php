<?php

namespace Tests\Feature\Student;

use App\Models\Character;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\ForumMessage;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ForumTest extends TestCase
{
    protected $character;

    protected $course;

    protected $student;

    protected $unregisteredStudent;

    protected $mentor;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);

        // Pastikan ada karakter default
        $this->character = Character::first() ?? Character::create([
            'name' => 'Default Character',
            'avatar' => 'warrior.png',
            'character_type' => ['attack'],
        ]);

        // Buat data course dummy
        $this->course = Course::create([
            'title' => 'Laravel Mastery',
            'slug' => 'laravel-mastery-'.uniqid(),
            'description' => 'Learn Laravel framework from scratch',
            'status' => 'published',
            'is_active' => true,
        ]);

        // Siswa terdaftar
        $this->student = User::create([
            'name' => 'John Student',
            'email' => 'john_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $this->character->_id,
        ]);

        CourseStudent::create([
            'user_id' => $this->student->_id,
            'course_id' => $this->course->_id,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        // Siswa tidak terdaftar
        $this->unregisteredStudent = User::create([
            'name' => 'Jane Student',
            'email' => 'jane_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $this->character->_id,
        ]);

        // Mentor
        $this->mentor = User::create([
            'name' => 'Mentor Dave',
            'email' => 'mentor_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'mentor',
        ]);
    }

    protected function tearDown(): void
    {
        // Bersihkan data setelah test agar tidak menumpuk
        if ($this->course) {
            ForumMessage::where('course_id', $this->course->_id)->delete();
            CourseStudent::where('course_id', $this->course->_id)->delete();
            $this->course->delete();
        }
        if ($this->student) {
            $this->student->delete();
        }
        if ($this->unregisteredStudent) {
            $this->unregisteredStudent->delete();
        }
        if ($this->mentor) {
            $this->mentor->delete();
        }

        parent::tearDown();
    }

    public function test_guests_are_redirected_to_the_login_page_from_forum(): void
    {
        $response = $this->get('/student/forum');
        $response->assertRedirect(route('login'));
    }

    public function test_enrolled_student_can_access_the_forum_and_view_messages(): void
    {
        $this->actingAs($this->student);

        // Buat beberapa pesan terlebih dahulu
        ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Halo semuanya, selamat datang di kelas Laravel!',
        ]);

        $response = $this->get('/student/forum/'.$this->course->slug);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Forum/Index')
            ->has('courses')
            ->has('selectedCourse')
            ->has('messages')
            ->where('selectedCourse.id', $this->course->_id)
        );
    }

    public function test_non_enrolled_student_cannot_access_the_forum_of_a_course(): void
    {
        $this->actingAs($this->unregisteredStudent);

        $response = $this->get('/student/forum/'.$this->course->slug);

        $response->assertStatus(403);
    }

    public function test_student_can_send_message_to_the_forum(): void
    {
        $this->actingAs($this->student);

        $response = $this->post('/student/forum/'.$this->course->slug.'/messages', [
            'message' => 'Halo mentor, ada pertanyaan terkait Eloquent.',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('forum_messages', [
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Halo mentor, ada pertanyaan terkait Eloquent.',
        ], 'mongodb');
    }

    public function test_mentor_can_access_and_send_message_to_any_course_forum_without_enrollment(): void
    {
        $this->actingAs($this->mentor);

        // Mentor berkunjung ke forum
        $response = $this->get('/student/forum/'.$this->course->slug);
        $response->assertOk();

        // Mentor mengirim pesan
        $postResponse = $this->post('/student/forum/'.$this->course->slug.'/messages', [
            'message' => 'Saya mentor, siap membantu menjawab pertanyaan Anda.',
        ]);
        $postResponse->assertRedirect();

        $this->assertDatabaseHas('forum_messages', [
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Saya mentor, siap membantu menjawab pertanyaan Anda.',
        ], 'mongodb');
    }

    public function test_student_can_poll_for_new_messages(): void
    {
        $this->actingAs($this->student);

        // Buat pesan awal
        $msg1 = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Pesan Pertama',
        ]);

        // Polling semua pesan
        $response = $this->getJson('/student/forum/'.$this->course->slug.'/messages');
        $response->assertOk();
        $response->assertJsonCount(1);

        // Buat pesan baru
        $msg2 = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Pesan Kedua',
        ]);

        // Polling hanya pesan baru setelah pesan pertama
        $responseNew = $this->getJson('/student/forum/'.$this->course->slug.'/messages?after_id='.$msg1->_id);
        $responseNew->assertOk();
        $responseNew->assertJsonCount(1);

        $jsonData = $responseNew->json();
        $this->assertEquals('Pesan Kedua', $jsonData[0]['message']);
    }

    public function test_student_can_reply_to_a_message(): void
    {
        $this->actingAs($this->student);

        // Buat pesan asal
        $parent = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Pertanyaan Pembuka',
        ]);

        // Balas pesan
        $response = $this->post('/student/forum/'.$this->course->slug.'/messages', [
            'message' => 'Ini jawaban saya.',
            'parent_id' => $parent->_id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('forum_messages', [
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Ini jawaban saya.',
            'parent_id' => $parent->_id,
        ], 'mongodb');
    }

    public function test_student_can_react_to_a_message(): void
    {
        $this->actingAs($this->student);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Mohon dikomentari',
        ]);

        // Berikan reaksi
        $response = $this->postJson("/student/forum/messages/{$msg->_id}/reaction", [
            'emoji' => '👍',
        ]);

        $response->assertRedirect();

        $msgFresh = ForumMessage::find($msg->_id);
        $this->assertNotEmpty($msgFresh->reactions);
        $this->assertEquals('👍', $msgFresh->reactions[0]['emoji']);
        $this->assertEquals($this->student->_id, $msgFresh->reactions[0]['user_id']);

        // Batal reaksi (toggle reaction)
        $responseToggle = $this->postJson("/student/forum/messages/{$msg->_id}/reaction", [
            'emoji' => '👍',
        ]);
        $responseToggle->assertRedirect();

        $msgFresh = ForumMessage::find($msg->_id);
        $this->assertEmpty($msgFresh->reactions);
    }

    public function test_mentor_can_pin_and_unpin_message(): void
    {
        $this->actingAs($this->mentor);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Pesan Penting',
        ]);

        // Pin pesan
        $response = $this->postJson("/student/forum/messages/{$msg->_id}/pin");
        $response->assertRedirect();

        $msgFresh = ForumMessage::find($msg->_id);
        $this->assertTrue($msgFresh->is_pinned);

        // Unpin pesan
        $responseUnpin = $this->postJson("/student/forum/messages/{$msg->_id}/pin");
        $responseUnpin->assertRedirect();

        $msgFresh = ForumMessage::find($msg->_id);
        $this->assertFalse($msgFresh->is_pinned);
    }

    public function test_student_cannot_pin_message(): void
    {
        $this->actingAs($this->student);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->mentor->_id,
            'message' => 'Pesan Mentor',
        ]);

        $response = $this->postJson("/student/forum/messages/{$msg->_id}/pin");
        $response->assertStatus(403);
    }

    public function test_student_can_edit_their_own_message(): void
    {
        $this->actingAs($this->student);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Pesan asli',
        ]);

        $response = $this->putJson("/student/forum/messages/{$msg->_id}", [
            'message' => 'Pesan teredit',
        ]);

        $response->assertRedirect();

        $msgFresh = ForumMessage::find($msg->_id);
        $this->assertEquals('Pesan teredit', $msgFresh->message);
    }

    public function test_student_cannot_edit_other_students_message(): void
    {
        $otherStudent = User::create([
            'name' => 'Other Student',
            'email' => 'other_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $this->character->_id,
        ]);
        $this->actingAs($this->student);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $otherStudent->_id,
            'message' => 'Pesan orang lain',
        ]);

        $response = $this->putJson("/student/forum/messages/{$msg->_id}", [
            'message' => 'Mencoba mengedit',
        ]);

        $response->assertStatus(403);

        $msgFresh = ForumMessage::find($msg->_id);
        $this->assertEquals('Pesan orang lain', $msgFresh->message);
    }

    public function test_student_can_delete_their_own_message(): void
    {
        $this->actingAs($this->student);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Pesan yang ingin dihapus',
        ]);

        $response = $this->deleteJson("/student/forum/messages/{$msg->_id}");
        $response->assertRedirect();

        $this->assertNull(ForumMessage::find($msg->_id));
    }

    public function test_mentor_can_delete_any_students_message(): void
    {
        $this->actingAs($this->mentor);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $this->student->_id,
            'message' => 'Pesan student untuk dimoderasi',
        ]);

        $response = $this->deleteJson("/student/forum/messages/{$msg->_id}");
        $response->assertRedirect();

        $this->assertNull(ForumMessage::find($msg->_id));
    }

    public function test_student_cannot_delete_other_students_message(): void
    {
        $otherStudent = User::create([
            'name' => 'Other Student 2',
            'email' => 'other2_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $this->character->_id,
        ]);
        $this->actingAs($this->student);

        $msg = ForumMessage::create([
            'course_id' => $this->course->_id,
            'user_id' => $otherStudent->_id,
            'message' => 'Pesan orang lain',
        ]);

        $response = $this->deleteJson("/student/forum/messages/{$msg->_id}");
        $response->assertStatus(403);

        $this->assertNotNull(ForumMessage::find($msg->_id));
    }
}
