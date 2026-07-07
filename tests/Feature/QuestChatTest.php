<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\User;
use Tests\TestCase;

class QuestChatTest extends TestCase
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
            'name' => 'Admin Test',
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

    public function test_guests_cannot_access_chat_endpoints(): void
    {
        $quest = Quest::create([
            'title' => 'Test Quest',
            'description' => 'Test description',
            'min_salary' => 1000,
            'max_salary' => 5000,
            'deadline' => now()->addDays(2)->toIso8601String(),
            'status' => 'open',
            'creator_id' => 'some-creator-id',
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => 'some-student-id',
            'bid_amount' => 2000,
            'cv' => 'http://cv.com',
            'portfolio' => 'http://port.com',
            'proposal' => 'Proposal text',
            'status' => 'pending',
        ]);

        $response = $this->getJson("/quests/bids/{$bid->_id}/messages");
        $response->assertStatus(401);

        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", ['message' => 'Hello']);
        $response->assertStatus(401);
    }

    public function test_quest_creator_can_send_and_retrieve_messages(): void
    {
        $creator = $this->createStudent('Creator student');
        $applicant = $this->createStudent('Applicant student');

        $quest = Quest::create([
            'title' => 'Test Quest',
            'description' => 'Test description',
            'min_salary' => 1000,
            'max_salary' => 5000,
            'deadline' => now()->addDays(2)->toIso8601String(),
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => (string) $applicant->_id,
            'bid_amount' => 2000,
            'cv' => 'http://cv.com',
            'portfolio' => 'http://port.com',
            'proposal' => 'Proposal text',
            'status' => 'pending',
        ]);

        // Login as creator
        $this->actingAs($creator);

        // Send message
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Halo pelamar, saya tertarik dengan portofolio Anda.',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Halo pelamar, saya tertarik dengan portofolio Anda.')
            ->assertJsonPath('sender.name', $creator->name);

        // Retrieve message
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages");
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.message', 'Halo pelamar, saya tertarik dengan portofolio Anda.');
    }

    public function test_bid_applicant_can_send_and_retrieve_messages(): void
    {
        $creator = $this->createStudent('Creator student');
        $applicant = $this->createStudent('Applicant student');

        $quest = Quest::create([
            'title' => 'Test Quest',
            'description' => 'Test description',
            'min_salary' => 1000,
            'max_salary' => 5000,
            'deadline' => now()->addDays(2)->toIso8601String(),
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => (string) $applicant->_id,
            'bid_amount' => 2000,
            'cv' => 'http://cv.com',
            'portfolio' => 'http://port.com',
            'proposal' => 'Proposal text',
            'status' => 'pending',
        ]);

        // Login as applicant
        $this->actingAs($applicant);

        // Send message
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Halo pembuat quest, terima kasih atas kesempatannya.',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Halo pembuat quest, terima kasih atas kesempatannya.');

        // Retrieve messages
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages");
        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_third_party_students_cannot_access_chat(): void
    {
        $creator = $this->createStudent('Creator student');
        $applicant = $this->createStudent('Applicant student');
        $outsider = $this->createStudent('Outsider student');

        $quest = Quest::create([
            'title' => 'Test Quest',
            'description' => 'Test description',
            'min_salary' => 1000,
            'max_salary' => 5000,
            'deadline' => now()->addDays(2)->toIso8601String(),
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => (string) $applicant->_id,
            'bid_amount' => 2000,
            'cv' => 'http://cv.com',
            'portfolio' => 'http://port.com',
            'proposal' => 'Proposal text',
            'status' => 'pending',
        ]);

        // Login as outsider
        $this->actingAs($outsider);

        $response = $this->getJson("/quests/bids/{$bid->_id}/messages");
        $response->assertStatus(403);

        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", ['message' => 'Stolen entry']);
        $response->assertStatus(403);
    }

    public function test_admin_has_full_moderator_access_to_chats(): void
    {
        $creator = $this->createStudent('Creator student');
        $applicant = $this->createStudent('Applicant student');
        $admin = $this->createAdmin();

        $quest = Quest::create([
            'title' => 'Test Quest',
            'description' => 'Test description',
            'min_salary' => 1000,
            'max_salary' => 5000,
            'deadline' => now()->addDays(2)->toIso8601String(),
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => (string) $applicant->_id,
            'bid_amount' => 2000,
            'cv' => 'http://cv.com',
            'portfolio' => 'http://port.com',
            'proposal' => 'Proposal text',
            'status' => 'pending',
        ]);

        // Put a message first (from applicant)
        QuestMessage::create([
            'quest_bid_id' => (string) $bid->_id,
            'sender_id' => (string) $applicant->_id,
            'message' => 'Applicant message',
        ]);

        // Login as admin
        $this->actingAs($admin);

        // Retrieve messages
        $response = $this->getJson("/quests/bids/{$bid->_id}/messages");
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.message', 'Applicant message');

        // Admin can send message
        $response = $this->postJson("/quests/bids/{$bid->_id}/messages", [
            'message' => 'Pesan moderasi admin.',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Pesan moderasi admin.');
    }
}
