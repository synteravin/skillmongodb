<?php

namespace Tests\Feature\Student;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Quest::truncate();
        QuestBid::truncate();
    }

    private function createStudent(string $name): User
    {
        $character = Character::first() ?? Character::create([
            'name' => 'Default Character',
            'avatar' => 'warrior.png',
            'character_type' => ['attack'],
        ]);

        return User::create([
            'name' => $name,
            'email' => 'student_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $character->_id,
        ]);
    }

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin Test',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_guests_are_redirected_to_the_login_page_from_quests(): void
    {
        $response = $this->get('/student/quests');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_student_can_visit_quests_index(): void
    {
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        $response = $this->get('/student/quests');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Quests/Index')
            ->has('quests')
            ->has('filters')
        );
    }

    public function test_student_can_create_a_quest(): void
    {
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        $response = $this->post('/student/quests', [
            'title' => 'Test Freelance Job',
            'description' => 'Need a logo designer for our new app.',
            'min_budget' => 500000,
            'max_budget' => 1000000,
            'deadline' => now()->addDays(5)->toDateString(),
        ]);

        $quest = Quest::where('title', 'Test Freelance Job')->first();
        $this->assertNotNull($quest);
        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $this->assertEquals('draft', $quest->status);
        $this->assertEquals($student->_id, $quest->creator_id);
    }

    public function test_student_can_create_a_quest_with_attachments(): void
    {
        Storage::fake('s3');
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        $image = UploadedFile::fake()->image('mockup.png');
        $file = UploadedFile::fake()->create('brief.pdf', 100);

        $response = $this->post('/student/quests', [
            'title' => 'Quest With Attachments',
            'description' => 'Design request with attachments.',
            'min_budget' => 1000000,
            'max_budget' => 2000000,
            'deadline' => now()->addDays(5)->toDateString(),
            'images' => [$image],
            'files' => [$file],
        ]);

        $quest = Quest::where('title', 'Quest With Attachments')->first();
        $this->assertNotNull($quest);
        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $this->assertNotEmpty($quest->images);
        $this->assertNotEmpty($quest->files);
        $this->assertEquals('mockup.png', $quest->images[0]['name']);
        $this->assertEquals('brief.pdf', $quest->files[0]['name']);
    }

    public function test_student_can_edit_and_resubmit_rejected_quest(): void
    {
        Storage::fake('s3');
        $student = $this->createStudent('Student Creator');
        $quest = Quest::create([
            'title' => 'Rejected Quest Title',
            'description' => 'Original description',
            'min_budget' => 500000,
            'max_budget' => 1000000,
            'deadline' => now()->addDays(5),
            'status' => 'rejected',
            'rejection_note' => 'Please add brief document.',
            'creator_id' => $student->_id,
        ]);

        $this->actingAs($student);

        // Access edit form
        $editResponse = $this->get("/student/quests/{$quest->_id}/edit");
        $editResponse->assertOk();

        // Resubmit with new file
        $file = UploadedFile::fake()->create('specification.pdf', 200);
        $updateResponse = $this->post("/student/quests/{$quest->_id}/update", [
            '_method' => 'put',
            'title' => 'Updated & Resubmitted Quest',
            'description' => 'Updated description with additional details.',
            'min_budget' => 600000,
            'max_budget' => 1200000,
            'deadline' => now()->addDays(6)->toDateString(),
            'files' => [$file],
        ]);

        $updateResponse->assertRedirect(route('student.quests.show', $quest->_id));

        $quest->refresh();
        $this->assertEquals('Updated & Resubmitted Quest', $quest->title);
        $this->assertEquals('draft', $quest->status);
        $this->assertNull($quest->rejection_note);
        $this->assertNotEmpty($quest->files);
        $this->assertEquals('specification.pdf', $quest->files[0]['name']);
    }

    public function test_student_can_delete_draft_quest(): void
    {
        $student = $this->createStudent('Student Creator');
        $quest = Quest::create([
            'title' => 'Draft Quest To Delete',
            'description' => 'Description',
            'min_budget' => 500000,
            'max_budget' => 1000000,
            'deadline' => now()->addDays(5),
            'status' => 'draft',
            'creator_id' => $student->_id,
        ]);

        $this->actingAs($student);

        $response = $this->delete("/student/quests/{$quest->_id}");
        $response->assertRedirect(route('student.quests.index'));

        $this->assertNull(Quest::find($quest->_id));
    }

    public function test_student_can_bid_on_a_quest(): void
    {
        $creator = $this->createStudent('Quest Creator');
        $quest = Quest::create([
            'title' => 'Need landing page',
            'description' => 'Create a landing page using React.',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $creator->_id,
        ]);

        $bidder = $this->createStudent('Bidder Student');
        $this->actingAs($bidder);

        $response = $this->post("/student/quests/{$quest->_id}/bid", [
            'bid_amount' => 1500000,
            'cv' => 'http://drive.google.com/cv.pdf',
            'portfolio' => 'http://github.com/my-portfolio',
            'proposal' => 'I have 3 years of experience in React.',
        ]);

        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $bid = QuestBid::where('quest_id', $quest->_id)->where('student_id', $bidder->_id)->first();
        $this->assertNotNull($bid);
        $this->assertEquals(1500000, $bid->bid_amount);
        $this->assertEquals('pending', $bid->status);
    }

    public function test_creator_can_accept_a_bid(): void
    {
        $creator = $this->createStudent('Quest Creator');
        $quest = Quest::create([
            'title' => 'Need landing page',
            'description' => 'Create a landing page using React.',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $creator->_id,
        ]);

        $bidder1 = $this->createStudent('Bidder 1');
        $bid1 = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $bidder1->_id,
            'bid_amount' => 1500000,
            'cv' => 'CV 1',
            'portfolio' => 'Portfolio 1',
            'proposal' => 'Proposal 1',
            'status' => 'pending',
        ]);

        $bidder2 = $this->createStudent('Bidder 2');
        $bid2 = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $bidder2->_id,
            'bid_amount' => 1800000,
            'cv' => 'CV 2',
            'portfolio' => 'Portfolio 2',
            'proposal' => 'Proposal 2',
            'status' => 'pending',
        ]);

        $this->actingAs($creator);

        $response = $this->post("/student/quests/{$quest->_id}/accept-bid/{$bid1->_id}");
        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $quest->refresh();
        $bid1->refresh();
        $bid2->refresh();

        $this->assertEquals('ongoing', $quest->status);
        $this->assertEquals($bidder1->_id, $quest->worker_id);
        $this->assertEquals('accepted', $bid1->status);
        $this->assertEquals('rejected', $bid2->status);
    }

    public function test_admin_can_approve_draft_quest(): void
    {
        $student = $this->createStudent('Student Creator');
        $admin = $this->createAdmin();

        $quest = Quest::create([
            'title' => 'Student Draft Quest',
            'description' => 'A draft quest',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'draft',
            'creator_id' => (string) $student->_id,
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/approve-post");

        $response->assertRedirect(route('admin.quests.show', $quest->_id));
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('open', $quest->status);
    }

    public function test_admin_can_reject_draft_quest_with_rejection_note(): void
    {
        $student = $this->createStudent('Student Creator');
        $admin = $this->createAdmin();

        $quest = Quest::create([
            'title' => 'Student Draft Quest',
            'description' => 'A draft quest',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'draft',
            'creator_id' => (string) $student->_id,
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/reject-post", [
                'rejection_note' => 'Please provide a clearer description.',
            ]);

        $response->assertRedirect(route('admin.quests.show', $quest->_id));
        $response->assertSessionHas('warning');

        $quest->refresh();
        $this->assertEquals('rejected', $quest->status);
        $this->assertEquals('Please provide a clearer description.', $quest->rejection_note);
    }

    public function test_other_students_cannot_view_draft_or_rejected_quest(): void
    {
        $creator = $this->createStudent('Creator Student');
        $otherStudent = $this->createStudent('Other Student');

        $quest = Quest::create([
            'title' => 'Draft Quest',
            'description' => 'A draft quest',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'draft',
            'creator_id' => (string) $creator->_id,
        ]);

        // Creator can view their own draft quest
        $response = $this->actingAs($creator)->get("/student/quests/{$quest->_id}");
        $response->assertOk();

        // Other student cannot view creator's draft quest
        $response = $this->actingAs($otherStudent)->get("/student/quests/{$quest->_id}");
        $response->assertStatus(403);
    }

    public function test_creator_can_accept_bid_with_zero_gold(): void
    {
        $creator = $this->createStudent('Quest Creator');
        $quest = Quest::create([
            'title' => 'Need landing page',
            'description' => 'Create a landing page using React.',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $creator->_id,
        ]);

        $bidder = $this->createStudent('Bidder Student');
        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $bidder->_id,
            'bid_amount' => 1500000,
            'cv' => 'CV',
            'portfolio' => 'Portfolio',
            'proposal' => 'Proposal',
            'status' => 'pending',
        ]);

        $this->actingAs($creator);

        $response = $this->post("/student/quests/{$quest->_id}/accept-bid/{$bid->_id}");
        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $quest->refresh();
        $this->assertEquals('ongoing', $quest->status);
        $this->assertEquals($bidder->_id, $quest->worker_id);
    }

    public function test_quest_tier_calculated_on_creation(): void
    {
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        // Tier S: max_budget >= 10,000,000
        $this->post('/student/quests', [
            'title' => 'Tier S Quest',
            'description' => 'Description S',
            'min_budget' => 8000000,
            'max_budget' => 12000000,
            'deadline' => now()->addDays(5)->toDateString(),
        ]);
        $questS = Quest::where('title', 'Tier S Quest')->first();
        $this->assertEquals('S', $questS->tier);

        // Tier D: max_budget < 1,000,000
        $this->post('/student/quests', [
            'title' => 'Tier D Quest',
            'description' => 'Description D',
            'min_budget' => 100000,
            'max_budget' => 500000,
            'deadline' => now()->addDays(5)->toDateString(),
        ]);
        $questD = Quest::where('title', 'Tier D Quest')->first();
        $this->assertEquals('D', $questD->tier);
    }

    public function test_student_can_visit_quest_history(): void
    {
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        $response = $this->get('/student/quests/history');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Quests/History')
            ->has('quests')
            ->has('stats')
            ->has('filters')
        );
    }
}
