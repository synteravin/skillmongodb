<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class QuestSubmissionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Quest::truncate();
        UserStat::truncate();
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

    public function test_chosen_worker_can_submit_work(): void
    {
        Storage::fake('s3');

        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $zipFile = UploadedFile::fake()->create('project.zip', 500, 'application/zip');

        $response = $this->actingAs($worker)
            ->post("/student/quests/{$quest->_id}/submit", [
                'submission_file' => $zipFile,
                'submission_link' => 'https://github.com/my-project',
                'submission_note' => 'I have finished the portfolio project.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('submitted', $quest->status);
        $this->assertEquals('https://github.com/my-project', $quest->submission_link);
        $this->assertEquals('I have finished the portfolio project.', $quest->submission_note);
        $this->assertNotNull($quest->submitted_at);

        $this->assertNotNull($quest->submission_file);
        $this->assertEquals('project.zip', $quest->submission_file['name']);
        Storage::disk('s3')->assertExists($quest->submission_file['path']);
    }

    public function test_creator_can_approve_work_and_worker_gets_rewards(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'submitted',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'submission_link' => 'https://github.com/my-project',
            'submission_note' => 'Done.',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($creator)
            ->post("/student/quests/{$quest->_id}/approve", [
                'rating' => 5,
                'rating_comment' => 'Great work!',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('completed', $quest->status);
        $this->assertEquals(5, $quest->rating);
        $this->assertEquals('Great work!', $quest->rating_comment);
        $this->assertNotNull($quest->completed_at);

        // Check gamification rewards
        $stat = UserStat::where('user_id', (string) $worker->_id)
            ->where('course_id', 'quest_rewards')
            ->first();

        $this->assertNotNull($stat);
        $pathStats = $stat->path_stats;
        $questKey = (string) $quest->_id;
        $this->assertEquals(250, $pathStats[$questKey]['exp']);
        $this->assertEquals(150, $pathStats[$questKey]['gold']);
        $this->assertEquals(100, $pathStats[$questKey]['quiz_score']);
    }

    public function test_creator_can_reject_work_and_request_revision(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'submitted',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'submission_link' => 'https://github.com/my-project',
            'submission_note' => 'Done.',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($creator)
            ->post("/student/quests/{$quest->_id}/reject", [
                'revision_note' => 'Please fix the footer.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('warning');

        $quest->refresh();
        $this->assertEquals('ongoing', $quest->status);
        $this->assertEquals('Please fix the footer.', $quest->revision_note);
    }

    public function test_other_user_cannot_submit_or_approve_work(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');
        $other = $this->createStudent('Other Student');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        // Try submitting as other
        $zipFile = UploadedFile::fake()->create('project.zip', 500, 'application/zip');
        $response1 = $this->actingAs($other)
            ->post("/student/quests/{$quest->_id}/submit", [
                'submission_file' => $zipFile,
                'submission_link' => 'https://github.com/my-project',
            ]);
        $response1->assertStatus(403);

        // Turn status to submitted
        $quest->update(['status' => 'submitted']);

        // Try approving as other
        $response2 = $this->actingAs($other)
            ->post("/student/quests/{$quest->_id}/approve");
        $response2->assertStatus(403);
    }

    public function test_admin_can_accept_bid_via_admin_url(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $worker->_id,
            'bid_amount' => 1500,
            'cv' => 'cv.pdf',
            'portfolio' => 'portfolio.com',
            'proposal' => 'Let me do it.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/accept-bid/{$bid->_id}");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('ongoing', $quest->status);
        $this->assertEquals((string) $worker->_id, $quest->worker_id);

        $bid->refresh();
        $this->assertEquals('accepted', $bid->status);
    }

    public function test_admin_can_approve_work_via_admin_url(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'submitted',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'submission_link' => 'https://github.com/my-project',
            'submission_note' => 'Done.',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/approve", [
                'rating' => 4,
                'rating_comment' => 'Approved by Admin.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('completed', $quest->status);
        $this->assertEquals(4, $quest->rating);
        $this->assertEquals('Approved by Admin.', $quest->rating_comment);

        // Check gamification rewards
        $stat = UserStat::where('user_id', (string) $worker->_id)
            ->where('course_id', 'quest_rewards')
            ->first();

        $this->assertNotNull($stat);
        $pathStats = $stat->path_stats;
        $questKey = (string) $quest->_id;
        $this->assertEquals(250, $pathStats[$questKey]['exp']);
        $this->assertEquals(150, $pathStats[$questKey]['gold']);
        $this->assertEquals(100, $pathStats[$questKey]['quiz_score']);
    }

    public function test_admin_can_reject_work_via_admin_url(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'submitted',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'submission_link' => 'https://github.com/my-project',
            'submission_note' => 'Done.',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/reject", [
                'revision_note' => 'Footer missing.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('warning');

        $quest->refresh();
        $this->assertEquals('ongoing', $quest->status);
        $this->assertEquals('Footer missing.', $quest->revision_note);
    }

    public function test_student_can_create_quest_with_attachments(): void
    {
        Storage::fake('s3');

        $creator = $this->createStudent('Creator');

        $image = UploadedFile::fake()->image('screenshot.jpg');
        $document = UploadedFile::fake()->create('specs.pdf', 500, 'application/pdf');

        $response = $this->actingAs($creator)
            ->post('/student/quests', [
                'title' => 'Quest with attachments',
                'description' => 'Detailed description here',
                'min_salary' => 1000,
                'max_salary' => 2000,
                'deadline' => now()->addDays(2)->toDateString(),
                'images' => [$image],
                'files' => [$document],
            ]);

        $response->assertRedirect();

        $quest = Quest::first();
        $this->assertNotNull($quest);
        $this->assertEquals('Quest with attachments', $quest->title);

        $this->assertCount(1, $quest->images);
        $this->assertCount(1, $quest->files);

        $this->assertEquals('screenshot.jpg', $quest->images[0]['name']);
        $this->assertEquals('specs.pdf', $quest->files[0]['name']);

        // Assert file exists on S3
        Storage::disk('s3')->assertExists($quest->images[0]['path']);
        Storage::disk('s3')->assertExists($quest->files[0]['path']);
    }
}
