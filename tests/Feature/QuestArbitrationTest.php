<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestTransaction;
use App\Models\User;
use App\Models\UserStat;
use Tests\TestCase;

class QuestArbitrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Quest::truncate();
        User::truncate();
        UserStat::truncate();
        QuestTransaction::truncate();
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
            'name' => 'Admin User',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_student_can_file_dispute(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'submitted',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $response = $this->actingAs($worker)
            ->post("/student/quests/{$quest->_id}/dispute", [
                'reason' => 'Creator refuses to pay and demands endless revisions without clear feedback.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('disputed', $quest->status);
        $this->assertNotNull($quest->dispute);
        $this->assertEquals('pending', $quest->dispute['status']);
        $this->assertEquals('Creator refuses to pay and demands endless revisions without clear feedback.', $quest->dispute['reason']);
        $this->assertEquals((string) $worker->_id, (string) $quest->dispute['disputer_id']);
    }

    public function test_admin_can_resolve_dispute_with_refund(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'disputed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'dispute' => [
                'status' => 'pending',
                'reason' => 'Dispute reason',
                'disputer_id' => (string) $worker->_id,
                'filer_name' => $worker->name,
                'ruled_at' => now()->toIso8601String(),
            ],
        ]);

        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $worker->_id,
            'bid_amount' => 1500,
            'status' => 'accepted',
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/arbitrate", [
                'ruling' => 'refund',
                'note' => 'Ruling that creator gets full refund.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('cancelled', $quest->status);
        $this->assertEquals('resolved_refund_creator', $quest->dispute['status']);

        // Check ledger transaction (No refund transaction is recorded for the creator since they were never charged escrow)
        $transaction = QuestTransaction::where('quest_id', $quest->_id)
            ->where('type', 'refund_escrow')
            ->first();
        $this->assertNull($transaction);
    }

    public function test_admin_can_resolve_dispute_with_split(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'disputed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'rewards' => ['exp' => 250, 'gold' => 150, 'erp' => 100],
            'dispute' => [
                'status' => 'pending',
                'reason' => 'Dispute reason',
                'disputer_id' => (string) $worker->_id,
                'filer_name' => $worker->name,
                'ruled_at' => now()->toIso8601String(),
            ],
        ]);

        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $worker->_id,
            'bid_amount' => 1000,
            'status' => 'accepted',
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/arbitrate", [
                'ruling' => 'split',
                'split_percentage' => 60,
                'note' => 'Split payout of 60% worker.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('completed', $quest->status);
        $this->assertEquals('resolved_split', $quest->dispute['status']);
        $this->assertEquals(60, $quest->dispute['split_percentage']);

        // Check ledger transactions
        $workerTx = QuestTransaction::where('quest_id', $quest->_id)
            ->where('type', 'release_payout')
            ->first();
        $this->assertNotNull($workerTx);
        $this->assertEquals(90, $workerTx->amount);

        // No refund transaction is recorded for the creator
        $creatorTx = QuestTransaction::where('quest_id', $quest->_id)
            ->where('type', 'refund_escrow')
            ->first();
        $this->assertNull($creatorTx);
    }

    public function test_admin_can_extend_quest_deadline(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');
        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->subDays(1),
            'status' => 'expired',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $admin = $this->createAdmin();
        $newDeadline = now()->addDays(10)->startOfMinute();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/extend-deadline", [
                'deadline' => $newDeadline->toIso8601String(),
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals($newDeadline->toIso8601String(), $quest->deadline->toIso8601String());
        $this->assertEquals('ongoing', $quest->status);
    }

    public function test_admin_can_reopen_bidding(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $worker->_id,
            'bid_amount' => 1500,
            'status' => 'accepted',
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/reopen-bidding");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('open', $quest->status);
        $this->assertNull($quest->worker_id);

        $bid->refresh();
        $this->assertEquals('rejected', $bid->status);

        // No refund transaction is recorded for the creator
        $transaction = QuestTransaction::where('quest_id', $quest->_id)
            ->where('type', 'refund_escrow')
            ->first();
        $this->assertNull($transaction);
    }

    public function test_student_can_file_dispute_when_status_is_approved(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'approved',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $response = $this->actingAs($worker)
            ->post("/student/quests/{$quest->_id}/dispute", [
                'reason' => 'Worker disputes work on approved state before final ZIP upload.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('disputed', $quest->status);
        $this->assertNotNull($quest->dispute);
        $this->assertEquals('pending', $quest->dispute['status']);
        $this->assertEquals('Worker disputes work on approved state before final ZIP upload.', $quest->dispute['reason']);
    }

    public function test_admin_force_cancel_resolves_pending_dispute(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'disputed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'dispute' => [
                'status' => 'pending',
                'reason' => 'Dispute reason',
                'disputer_id' => (string) $worker->_id,
                'filer_name' => $worker->name,
                'ruled_at' => now()->toIso8601String(),
            ],
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/force-cancel");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('cancelled', $quest->status);
        $this->assertNotNull($quest->dispute);
        $this->assertEquals('resolved_cancelled', $quest->dispute['status']);
        $this->assertEquals('refund', $quest->dispute['ruling']);
        $this->assertEquals('Quest dibatalkan secara paksa oleh Admin.', $quest->dispute['note']);
    }

    public function test_admin_reopen_bidding_clears_pending_dispute(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'disputed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'dispute' => [
                'status' => 'pending',
                'reason' => 'Dispute reason',
                'disputer_id' => (string) $worker->_id,
                'filer_name' => $worker->name,
                'ruled_at' => now()->toIso8601String(),
            ],
        ]);

        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $worker->_id,
            'bid_amount' => 1500,
            'status' => 'accepted',
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/reopen-bidding");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('open', $quest->status);
        $this->assertNull($quest->worker_id);
        $this->assertNull($quest->dispute);

        $bid->refresh();
        $this->assertEquals('rejected', $bid->status);
    }
}
