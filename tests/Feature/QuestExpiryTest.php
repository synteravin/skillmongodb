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

    public function test_console_command_marks_expired_quests_and_applies_erp_penalty(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        // Create initial stats for the worker with 50 ERP
        UserStat::create([
            'user_id' => (string) $worker->_id,
            'erp' => 50,
            'exp' => 100,
            'gold' => 100,
            'level' => 1,
        ]);

        // Quest 1: Expired (Deadline is in the past)
        $expiredQuest = Quest::create([
            'title' => 'Expired Quest',
            'description' => 'Should be marked as expired',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->subHours(2), // 2 hours ago
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        // Quest 2: Active (Deadline is in the future)
        $activeQuest = Quest::create([
            'title' => 'Active Quest',
            'description' => 'Should remain ongoing',
            'min_salary' => 1000,
            'max_salary' => 2000,
            'deadline' => now()->addHours(2), // 2 hours from now
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
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
        $this->assertNull($expiredQuest->worker_id);

        // Assert Quest 2 (Active) is untouched
        $activeQuest->refresh();
        $this->assertEquals('ongoing', $activeQuest->status);
        $this->assertEquals((string) $worker->_id, $activeQuest->worker_id);

        // Assert ERP penalty is applied to worker (-10 ERP, so 50 -> 40)
        $workerStat = UserStat::where('user_id', (string) $worker->_id)->first();
        $this->assertEquals(40, $workerStat->erp);
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
