<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\User;
use App\Models\UserStat;
use Tests\TestCase;

class QuestExpiryTest extends TestCase
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

    public function test_console_command_marks_expired_open_quests(): void
    {
        $creator = $this->createStudent('Creator');

        // Quest 1: Expired Open (Deadline is in the past)
        $expiredQuest = Quest::create([
            'title' => 'Expired Quest',
            'description' => 'Should be marked as expired',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->subHours(2), // 2 hours ago
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        // Quest 2: Active Open (Deadline is in the future)
        $activeQuest = Quest::create([
            'title' => 'Active Quest',
            'description' => 'Should remain open',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->addHours(2), // 2 hours from now
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        // Run the console command
        $this->artisan('quests:check-expiry')
            ->expectsOutput('Memulai pengecekan quest kadaluarsa...')
            ->expectsOutput("Quest ID {$expiredQuest->_id} ('Expired Quest') dinyatakan kadaluarsa.")
            ->expectsOutput('Pengecekan selesai. Total 1 quest kadaluarsa diproses.')
            ->assertExitCode(0);

        // Assert Quest 1 (Expired) is updated correctly
        $expiredQuest->refresh();
        $this->assertEquals('expired', $expiredQuest->status);

        // Assert Quest 2 (Active) is untouched
        $activeQuest->refresh();
        $this->assertEquals('open', $activeQuest->status);
    }

    public function test_creator_can_extend_deadline_of_expired_quest(): void
    {
        $creator = $this->createStudent('Creator');

        $expiredQuest = Quest::create([
            'title' => 'Expired Quest Title',
            'description' => 'Expired Quest Description',
            'min_salary' => 1200,
            'max_salary' => 2500,
            'deadline' => now()->subHours(1),
            'status' => 'expired',
            'creator_id' => (string) $creator->_id,
        ]);

        $newDeadline = now()->addDays(7)->toIso8601String();

        $response = $this->actingAs($creator)
            ->post(route('student.quests.extend-deadline', $expiredQuest->_id), [
                'deadline' => $newDeadline,
            ]);

        $response->assertRedirect(route('student.quests.show', $expiredQuest->_id));

        $expiredQuest->refresh();
        $this->assertEquals('open', $expiredQuest->status);
        $this->assertEquals(now()->parse($newDeadline)->toDateTimeString(), $expiredQuest->deadline->toDateTimeString());
    }

    public function test_creator_can_extend_deadline_of_ongoing_quest(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $ongoingQuest = Quest::create([
            'title' => 'Ongoing Quest Title',
            'description' => 'Ongoing Quest Description',
            'min_salary' => 1200,
            'max_salary' => 2500,
            'deadline' => now()->addDays(1),
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $newDeadline = now()->addDays(7)->toIso8601String();

        $response = $this->actingAs($creator)
            ->post(route('student.quests.extend-deadline', $ongoingQuest->_id), [
                'deadline' => $newDeadline,
            ]);

        $response->assertRedirect(route('student.quests.show', $ongoingQuest->_id));

        $ongoingQuest->refresh();
        $this->assertEquals('ongoing', $ongoingQuest->status);
        $this->assertEquals(now()->parse($newDeadline)->toDateTimeString(), $ongoingQuest->deadline->toDateTimeString());
    }

    public function test_quest_repost_prefills_template_data(): void
    {
        $creator = $this->createStudent('Creator');

        $expiredQuest = Quest::create([
            'title' => 'Expired Quest Title',
            'description' => 'Expired Quest Description',
            'min_salary' => 1200,
            'max_salary' => 2500,
            'deadline' => now()->subHours(1),
            'status' => 'expired',
            'creator_id' => (string) $creator->_id,
        ]);

        // Access the create route with template_id as creator
        $response = $this->actingAs($creator)
            ->get(route('student.quests.create', ['template_id' => (string) $expiredQuest->_id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Quests/Create')
            ->has('template', fn ($template) => $template
                ->where('title', 'Expired Quest Title')
                ->where('description', 'Expired Quest Description')
                ->where('min_salary', 1200)
                ->where('max_salary', 2500)
            )
        );
    }
}
