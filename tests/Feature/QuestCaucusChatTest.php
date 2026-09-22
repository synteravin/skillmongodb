<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\User;
use Tests\TestCase;

class QuestCaucusChatTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Quest::truncate();
        QuestBid::truncate();
        QuestMessage::truncate();
    }

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin Mediator',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
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

    private function setupDisputedQuest(): array
    {
        $admin = $this->createAdmin();
        $creator = $this->createStudent('Client Creator');
        $worker = $this->createStudent('Freelance Worker');

        $quest = Quest::create([
            'title' => 'Disputed Project',
            'description' => 'Project with dispute',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5)->toIso8601String(),
            'status' => 'disputed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => (string) $worker->_id,
            'bid_amount' => 1500000,
            'status' => 'accepted',
        ]);

        return [$admin, $creator, $worker, $quest, $bid];
    }

    public function test_admin_can_access_all_channels(): void
    {
        [$admin, $creator, $worker, $quest, $bid] = $this->setupDisputedQuest();

        $this->actingAs($admin);

        // Tripartite
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=tripartite");
        $response->assertStatus(200);

        // Caucus Creator
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_creator");
        $response->assertStatus(200);

        // Caucus Worker
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_worker");
        $response->assertStatus(200);

        // Post to Caucus Creator
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Pesan rahasia untuk Klien dari Mediator',
            'channel_type' => 'caucus_creator',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('channel_type', 'caucus_creator');

        // Post to Caucus Worker
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Pesan rahasia untuk Pekerja dari Mediator',
            'channel_type' => 'caucus_worker',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('channel_type', 'caucus_worker');
    }

    public function test_creator_can_access_creator_caucus_but_is_forbidden_from_worker_caucus(): void
    {
        [$admin, $creator, $worker, $quest, $bid] = $this->setupDisputedQuest();

        $this->actingAs($creator);

        // Creator can access tripartite
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=tripartite");
        $response->assertStatus(200);

        // Creator can access own caucus
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_creator");
        $response->assertStatus(200);

        // Creator can send message in own caucus
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Klarifikasi rahasia dari Klien',
            'channel_type' => 'caucus_creator',
        ]);
        $response->assertStatus(200);

        // Creator is FORBIDDEN from accessing worker caucus
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_worker");
        $response->assertStatus(403);

        // Creator is FORBIDDEN from sending to worker caucus
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Mencoba menyusup ke kaukus pekerja',
            'channel_type' => 'caucus_worker',
        ]);
        $response->assertStatus(403);
    }

    public function test_worker_can_access_worker_caucus_but_is_forbidden_from_creator_caucus(): void
    {
        [$admin, $creator, $worker, $quest, $bid] = $this->setupDisputedQuest();

        $this->actingAs($worker);

        // Worker can access tripartite
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=tripartite");
        $response->assertStatus(200);

        // Worker can access own caucus
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_worker");
        $response->assertStatus(200);

        // Worker can send message in own caucus
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Klarifikasi rahasia dari Pekerja',
            'channel_type' => 'caucus_worker',
        ]);
        $response->assertStatus(200);

        // Worker is FORBIDDEN from accessing creator caucus
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_creator");
        $response->assertStatus(403);

        // Worker is FORBIDDEN from sending to creator caucus
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Mencoba menyusup ke kaukus klien',
            'channel_type' => 'caucus_creator',
        ]);
        $response->assertStatus(403);
    }

    public function test_channel_isolation_ensures_messages_do_not_bleed_across_channels(): void
    {
        [$admin, $creator, $worker, $quest, $bid] = $this->setupDisputedQuest();

        // 1. Send 1 message in tripartite
        $this->actingAs($admin);
        $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Pesan Pleno Bersama',
            'channel_type' => 'tripartite',
        ])->assertStatus(200);

        // 2. Send 1 message in caucus_creator
        $this->actingAs($creator);
        $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Pesan Khusus Klien',
            'channel_type' => 'caucus_creator',
        ])->assertStatus(200);

        // 3. Send 1 message in caucus_worker
        $this->actingAs($worker);
        $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Pesan Khusus Pekerja',
            'channel_type' => 'caucus_worker',
        ])->assertStatus(200);

        // Verify Tripartite only has 1 message
        $response = $this->actingAs($admin)->getJson("/quests/bids/{$bid->_id}/messages?channel_type=tripartite");
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.message', 'Pesan Pleno Bersama');

        // Verify Caucus Creator only has 1 message
        $response = $this->actingAs($admin)->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_creator");
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.message', 'Pesan Khusus Klien');

        // Verify Caucus Worker only has 1 message
        $response = $this->actingAs($admin)->getJson("/quests/bids/{$bid->_id}/messages?channel_type=caucus_worker");
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.message', 'Pesan Khusus Pekerja');
    }

    public function test_invalid_channel_type_is_rejected(): void
    {
        [$admin, $creator, $worker, $quest, $bid] = $this->setupDisputedQuest();

        $this->actingAs($admin);

        $response = $this->getJson("/quests/bids/{$bid->_id}/messages?channel_type=invalid_channel");
        $response->assertStatus(400);

        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Test',
            'channel_type' => 'invalid_channel',
        ]);
        $response->assertStatus(400);
    }
}
