<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
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
        $this->assertEquals('refund_creator', $quest->dispute['ruling']);
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

    public function test_rejected_bidder_cannot_access_chat(): void
    {
        $creator = $this->createStudent('Creator');
        $rejectedWorker = $this->createStudent('Rejected Worker');

        $quest = Quest::create([
            'title' => 'Quest title',
            'description' => 'Desc',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $rejectedWorker->_id,
            'bid_amount' => 1500,
            'status' => 'rejected',
        ]);

        $response = $this->actingAs($rejectedWorker)
            ->getJson("/quests/bids/{$bid->_id}/messages");
        $response->assertStatus(403);

        $responsePost = $this->actingAs($rejectedWorker)
            ->postJson("/quests/bids/{$bid->_id}/messages", ['message' => 'spam']);
        $responsePost->assertStatus(403);
    }

    public function test_submission_clears_revision_note(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Quest title',
            'description' => 'Desc',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'ongoing',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'revision_note' => 'Please fix the CSS.',
        ]);

        $response = $this->actingAs($worker)
            ->post("/student/quests/{$quest->_id}/submit", [
                'submission_link' => 'https://github.com/test',
                'submission_note' => 'I fixed it.',
            ]);

        $response->assertRedirect();

        $quest->refresh();
        $this->assertEquals('submitted', $quest->status);
        $this->assertNull($quest->revision_note);
    }

    public function test_cascading_delete_removes_messages_and_transactions(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Quest title',
            'description' => 'Desc',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => (string) $creator->_id,
        ]);

        $bid = QuestBid::create([
            'quest_id' => (string) $quest->_id,
            'student_id' => (string) $worker->_id,
            'bid_amount' => 1500,
            'status' => 'pending',
        ]);

        $message = QuestMessage::create([
            'quest_bid_id' => (string) $bid->_id,
            'sender_id' => (string) $worker->_id,
            'message' => 'Hello',
        ]);

        $transaction = QuestTransaction::create([
            'quest_id' => (string) $quest->_id,
            'user_id' => (string) $worker->_id,
            'amount' => 1500,
            'type' => 'release_payout',
            'description' => 'Virtual Escrow release',
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->delete("/admin/quests/{$quest->_id}");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertNull(Quest::find($quest->_id));
        $this->assertNull(QuestBid::find($bid->_id));
        $this->assertNull(QuestMessage::find($message->_id));
        $this->assertNull(QuestTransaction::find($transaction->_id));
    }

    public function test_admin_cannot_reopen_bidding_on_completed_or_cancelled_quest(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $questCompleted = Quest::create([
            'title' => 'Quest completed',
            'description' => 'Desc',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'completed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $questCancelled = Quest::create([
            'title' => 'Quest cancelled',
            'description' => 'Desc',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'cancelled',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
        ]);

        $admin = $this->createAdmin();

        $responseCompleted = $this->actingAs($admin)
            ->post("/admin/quests/{$questCompleted->_id}/reopen-bidding");
        $responseCompleted->assertStatus(400);

        $responseCancelled = $this->actingAs($admin)
            ->post("/admin/quests/{$questCancelled->_id}/reopen-bidding");
        $responseCancelled->assertStatus(400);
    }
}
