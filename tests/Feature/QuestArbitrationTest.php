<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\QuestTransaction;
use App\Models\User;
use App\Models\UserStat;
use App\Services\Quest\QuestService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
            ->post("/quests/{$quest->_id}/dispute", [
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
            ->post("/quests/{$quest->_id}/dispute", [
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
        $response->assertStatus(200);

        $responsePost = $this->actingAs($rejectedWorker)
            ->postJson("/quests/bids/{$bid->_id}/messages", ['message' => 'spam']);
        $responsePost->assertStatus(422);
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
            ->post("/quests/{$quest->_id}/submit", [
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

    public function test_student_can_file_and_respond_dispute_with_evidence_files(): void
    {
        Storage::fake('s3');

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

        $file1 = UploadedFile::fake()->image('evidence1.jpg');
        $file2 = UploadedFile::fake()->create('contract.pdf', 500, 'application/pdf');

        $response = $this->actingAs($worker)
            ->post("/quests/{$quest->_id}/dispute", [
                'reason' => 'Creator refuses to pay with false claims.',
                'category' => 'non_payment',
                'evidence_files' => [$file1, $file2],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('disputed', $quest->status);
        $this->assertCount(2, $quest->dispute['evidence_files']);
        $this->assertEquals('evidence1.jpg', $quest->dispute['evidence_files'][0]['name']);
        $this->assertEquals('contract.pdf', $quest->dispute['evidence_files'][1]['name']);

        // Now creator responds with counter-evidence
        $counterFile = UploadedFile::fake()->image('rebuttal.png');
        $responseCounter = $this->actingAs($creator)
            ->post("/quests/{$quest->_id}/respond-dispute", [
                'response_note' => 'Here is my bank transfer record proving payment attempt.',
                'evidence_files' => [$counterFile],
            ]);

        $responseCounter->assertRedirect();
        $responseCounter->assertSessionHas('success');

        $quest->refresh();
        $this->assertNotNull($quest->dispute['response']);
        $this->assertEquals('Here is my bank transfer record proving payment attempt.', $quest->dispute['response']['response_note']);
        $this->assertCount(1, $quest->dispute['response']['evidence_files']);
        $this->assertEquals('rebuttal.png', $quest->dispute['response']['evidence_files'][0]['name']);
    }

    public function test_admin_can_request_additional_evidence(): void
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
            ->post("/admin/quests/{$quest->_id}/request-evidence", [
                'target_party' => 'worker',
                'instruction' => 'Silakan lampirkan log commit git dan rekaman demo.',
                'deadline_hours' => 48,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertNotEmpty($quest->dispute['evidence_requests']);
        $this->assertEquals('worker', $quest->dispute['evidence_requests'][0]['target_party']);
        $this->assertEquals('Silakan lampirkan log commit git dan rekaman demo.', $quest->dispute['evidence_requests'][0]['instruction']);
        $this->assertEquals(48, $quest->dispute['evidence_requests'][0]['deadline_hours']);
    }

    public function test_admin_can_extend_dispute_sla(): void
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
            ->post("/admin/quests/{$quest->_id}/extend-dispute-sla", [
                'additional_hours' => 24,
                'reason' => 'Pihak terlapor meminta waktu tambahan karena kendala teknis.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals(24, $quest->dispute['sla_extended_hours']);
        $this->assertEquals('Pihak terlapor meminta waktu tambahan karena kendala teknis.', $quest->dispute['sla_extension_reason']);
    }

    public function test_admin_can_verify_p2p_compliance(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000,
            'max_salary' => 3000,
            'deadline' => now()->addDays(5),
            'status' => 'cancelled',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'dispute' => [
                'status' => 'resolved_refund_creator',
                'ruling' => 'refund_creator',
                'reason' => 'Dispute reason',
                'disputer_id' => (string) $creator->_id,
                'filer_name' => $creator->name,
                'ruled_at' => now()->toIso8601String(),
            ],
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/verify-p2p-compliance", [
                'compliance_status' => 'verified',
                'audit_note' => 'Bukti mutasi rekening restitusi DP telah diperiksa dan dinyatakan sah.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertNotNull($quest->dispute['p2p_compliance']);
        $this->assertEquals('verified', $quest->dispute['p2p_compliance']['status']);
        $this->assertEquals('Bukti mutasi rekening restitusi DP telah diperiksa dan dinyatakan sah.', $quest->dispute['p2p_compliance']['audit_note']);
    }

    public function test_admin_can_resolve_dispute_with_sanctions(): void
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
                'disputer_id' => (string) $creator->_id,
                'filer_name' => $creator->name,
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
                'note' => 'Pekerja terbukti lalai dan mangkir dari tugas.',
                'sanction_type' => 'trust_penalty',
                'sanction_target' => 'worker',
                'sanction_reason' => 'Kelalaian fatal dalam pengerjaan kontrak.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('cancelled', $quest->status);
        $this->assertNotNull($quest->dispute['sanction']);
        $this->assertEquals('trust_penalty', $quest->dispute['sanction']['sanction_type']);
        $this->assertEquals('worker', $quest->dispute['sanction']['sanction_target']);
        $this->assertEquals('Kelalaian fatal dalam pengerjaan kontrak.', $quest->dispute['sanction']['sanction_reason']);
    }

    public function test_evidence_requests_are_confidential_between_mediator_and_target_party(): void
    {
        Storage::fake('s3');

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
                'disputer_id' => (string) $creator->_id,
                'filer_name' => $creator->name,
                'evidence_requests' => [
                    [
                        'id' => 'req_worker_123',
                        'target_party' => 'worker',
                        'instruction' => 'Lampirkan log repositori git rahasia.',
                        'deadline' => now()->addHours(48)->toIso8601String(),
                        'deadline_hours' => 48,
                        'status' => 'pending',
                        'created_at' => now()->toIso8601String(),
                    ],
                ],
            ],
        ]);

        $questService = app(QuestService::class);

        // 1. Worker should see the request
        $workerDetails = $questService->getQuestDetails($quest, $worker);
        $this->assertNotEmpty($workerDetails['quest']['dispute']['evidence_requests']);
        $this->assertEquals('req_worker_123', $workerDetails['quest']['dispute']['evidence_requests'][0]['id']);

        // 2. Creator should NOT see the request (Confidential to worker & mediator)
        $creatorDetails = $questService->getQuestDetails($quest, $creator);
        $this->assertEmpty($creatorDetails['quest']['dispute']['evidence_requests']);

        // 3. Creator trying to submit evidence to worker's request should receive 403 Forbidden
        $file = UploadedFile::fake()->create('proof.pdf', 500, 'application/pdf');
        $unauthorizedResponse = $this->actingAs($creator)
            ->post("/quests/{$quest->_id}/submit-evidence-request", [
                'request_id' => 'req_worker_123',
                'notes' => 'Mencoba submit bukti pekerja',
                'evidence_files' => [$file],
            ]);
        $unauthorizedResponse->assertStatus(403);

        // 4. Worker submitting evidence should succeed
        $authorizedResponse = $this->actingAs($worker)
            ->post("/quests/{$quest->_id}/submit-evidence-request", [
                'request_id' => 'req_worker_123',
                'notes' => 'Berikut log git rahasia.',
                'evidence_files' => [$file],
            ]);
        $authorizedResponse->assertRedirect();
        $authorizedResponse->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('submitted', $quest->dispute['evidence_requests'][0]['status']);
        $this->assertEquals($worker->name, $quest->dispute['evidence_requests'][0]['submitted_by']);

        // 5. Creator still cannot see it after submission
        $creatorDetailsAfter = $questService->getQuestDetails($quest, $creator);
        $this->assertEmpty($creatorDetailsAfter['quest']['dispute']['evidence_requests']);

        // 6. Admin can see it with resolved URLs
        $admin = $this->createAdmin();
        $adminDispute = $questService->resolveDispute($quest, $admin);
        $this->assertNotEmpty($adminDispute['evidence_requests']);
        $this->assertEquals('submitted', $adminDispute['evidence_requests'][0]['status']);
        $this->assertNotEmpty($adminDispute['evidence_requests'][0]['files']);
    }

    public function test_admin_arbitration_creates_award_and_p2p_compliance_with_findings_and_ratio(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'accepted_bid_amount' => 2000000,
            'dp_percentage' => 30,
            'dp_amount' => 600000,
            'rewards' => ['gold' => 200, 'exp' => 500],
            'deadline' => now()->addDays(5),
            'status' => 'disputed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'dispute' => [
                'status' => 'pending',
                'reason' => 'Pekerja menyelesaikan 70% deliverable lalu terjadi perselisihan.',
                'disputer_id' => (string) $worker->_id,
                'filer_name' => $worker->name,
                'ruled_at' => now()->toIso8601String(),
            ],
        ]);

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->post("/admin/quests/{$quest->_id}/arbitrate", [
                'ruling' => 'split',
                'split_percentage' => 70,
                'findings_of_fact' => 'Pemeriksaan repositori membuktikan 7 dari 10 modul telah rampung dan berfungsi.',
                'ratio_decidendi' => 'Berdasarkan klausul progres objektif, pekerja berhak menerima kompensasi 70% dari nilai kontrak.',
                'note' => 'Klien diwajibkan mentransfer kekurangan pembayaran ke pekerja dalam 72 jam.',
                'sanction_type' => 'none',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $this->assertEquals('completed', $quest->status);
        $this->assertEquals('resolved_split', $quest->dispute['status']);

        // Award verification
        $award = $quest->dispute['award'];
        $this->assertNotNull($award);
        $this->assertStringStartsWith('ARB-', $award['award_number']);
        $this->assertEquals('Pemeriksaan repositori membuktikan 7 dari 10 modul telah rampung dan berfungsi.', $award['findings_of_fact']);
        $this->assertEquals('Berdasarkan klausul progres objektif, pekerja berhak menerima kompensasi 70% dari nilai kontrak.', $award['ratio_decidendi']);
        $this->assertEquals('Dewan Arbitrase Skillmongo', $award['arbiter_name']);

        // Financial order verification (70% of 2,000,000 is 1,400,000. DP was 600,000. Creator pays 800,000 to worker)
        $this->assertEquals(800000, $award['financial_order']['amount']);
        $this->assertEquals('creator', $award['financial_order']['paying_party']);
        $this->assertEquals('worker', $award['financial_order']['receiving_party']);

        // Platform rewards verification
        $this->assertEquals(140, $award['platform_reward_order']['gold_worker']);
        $this->assertEquals(350, $award['platform_reward_order']['exp_worker']);

        // P2P compliance timer verification
        $compliance = $quest->dispute['p2p_compliance'];
        $this->assertNotNull($compliance);
        $this->assertEquals('pending_payment', $compliance['status']);
        $this->assertEquals(800000, $compliance['amount']);
        $this->assertEquals('creator', $compliance['paying_party']);
        $this->assertNotNull($compliance['payment_deadline']);
    }

    public function test_p2p_ledger_and_simulation_calculation(): void
    {
        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'accepted_bid_amount' => 1000000,
            'dp_percentage' => 30,
            'dp_amount' => 300000,
            'rewards' => ['gold' => 100, 'exp' => 200],
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

        $questService = app(QuestService::class);
        $resolvedDispute = $questService->resolveDispute($quest, $worker);

        $this->assertNotNull($resolvedDispute['p2p_ledger']);
        $ledger = $resolvedDispute['p2p_ledger'];
        $this->assertEquals(1000000, $ledger['contract_amount']);
        $this->assertEquals(30, $ledger['dp_percentage']);
        $this->assertEquals(300000, $ledger['dp_amount']);
        $this->assertEquals(700000, $ledger['remaining_balance']);
        $this->assertEquals(1000000, $ledger['disputed_amount']);

        $simulation = $ledger['ruling_simulation'];
        $this->assertEquals(300000, $simulation['refund_creator']['amount']);
        $this->assertEquals('worker', $simulation['refund_creator']['paying_party']);

        $this->assertEquals(700000, $simulation['release_payout']['amount']);
        $this->assertEquals('creator', $simulation['release_payout']['paying_party']);

        // Split 50%: 500,000 worker share - 300,000 DP = 200,000 from creator
        $this->assertEquals(200000, $simulation['split']['amount']);
        $this->assertEquals('creator', $simulation['split']['paying_party']);
    }

    public function test_student_upload_p2p_compliance_proof_with_bank_metadata(): void
    {
        Storage::fake('s3');

        $creator = $this->createStudent('Creator');
        $worker = $this->createStudent('Worker');

        $quest = Quest::create([
            'title' => 'Freelance Web Design',
            'description' => 'Create web portfolio',
            'accepted_bid_amount' => 1000000,
            'dp_amount' => 300000,
            'status' => 'completed',
            'creator_id' => (string) $creator->_id,
            'worker_id' => (string) $worker->_id,
            'dispute' => [
                'status' => 'resolved_split',
                'ruling' => 'split',
                'split_percentage' => 50,
                'p2p_compliance' => [
                    'status' => 'pending_payment',
                    'amount' => 200000,
                    'paying_party' => 'creator',
                    'receiving_party' => 'worker',
                    'payment_deadline' => now()->addHours(72)->toIso8601String(),
                ],
            ],
        ]);

        $proofFile = UploadedFile::fake()->image('transfer_receipt.jpg');

        $response = $this->actingAs($creator)
            ->post("/quests/{$quest->_id}/upload-p2p-compliance-proof", [
                'compliance_proof' => $proofFile,
                'bank_source' => 'BCA (Bank Central Asia)',
                'account_name_destination' => 'Budi Santoso',
                'transaction_ref_no' => 'BCA-20260920-8899',
                'amount' => 200000,
                'transferred_at' => now()->toIso8601String(),
                'transfer_note' => 'Transfer sisa bagi hasil arbitrase 50% telah selesai.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $quest->refresh();
        $compliance = $quest->dispute['p2p_compliance'];
        $this->assertEquals('pending_verification', $compliance['status']);
        $this->assertEquals('BCA (Bank Central Asia)', $compliance['bank_source']);
        $this->assertEquals('Budi Santoso', $compliance['account_name_destination']);
        $this->assertEquals('BCA-20260920-8899', $compliance['transaction_ref_no']);
        $this->assertEquals(200000, $compliance['amount']);
        $this->assertEquals('transfer_receipt.jpg', $compliance['proof_file']['name']);
        $this->assertEquals('Transfer sisa bagi hasil arbitrase 50% telah selesai.', $compliance['transfer_note']);
    }
}
