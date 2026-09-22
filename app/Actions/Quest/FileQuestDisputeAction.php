<?php

namespace App\Actions\Quest;

use App\Enums\DisputeStatus;
use App\Enums\QuestIssueCategory;
use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class FileQuestDisputeAction
{
    /**
     * Execute the action to file a formal dispute for the quest.
     */
    public function execute(Quest $quest, User $user, string $reason, ?string $category = null, array $evidenceFiles = []): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $user->_id;
        $isWorker = (string) $quest->worker_id === (string) $user->_id;
        $isAdmin = $user->isAdmin();

        if (! $isCreator && ! $isWorker && ! $isAdmin) {
            abort(403, 'Hanya pihak terkait kontrak atau admin yang dapat mengajukan eskalasi arbitrase.');
        }

        $currentStatus = $quest->status instanceof QuestStatus ? $quest->status->value : (string) $quest->status;

        $validStatuses = [
            QuestStatus::DOWN_PAYMENT->value,
            QuestStatus::ONGOING->value,
            QuestStatus::REVISION->value,
            QuestStatus::SUBMITTED->value,
            QuestStatus::APPROVED->value,
            QuestStatus::PAYMENT->value,
        ];

        if (! in_array($currentStatus, $validStatuses)) {
            abort(400, 'Quest tidak dalam status aktif atau peninjauan untuk diajukan arbitrase.');
        }

        $catEnum = $category ? QuestIssueCategory::tryFrom($category) : null;
        $categoryKey = $catEnum ? $catEnum->value : QuestIssueCategory::SCOPE_DISPUTE->value;
        $categoryLabel = $catEnum ? $catEnum->label() : 'Sengketa Proyek';

        $disputeData = [
            'disputed_at' => now()->toIso8601String(),
            'disputer_id' => (string) $user->_id,
            'filer_id' => (string) $user->_id,
            'filer_name' => $user->name,
            'category' => $categoryKey,
            'category_label' => $categoryLabel,
            'reason' => trim($reason),
            'evidence_files' => $evidenceFiles,
            'binding_agreement_accepted' => true,
            'status' => DisputeStatus::PENDING->value,
            'resolved_at' => null,
            'ruled_at' => null,
            'ruling_note' => null,
            'note' => null,
            'ruling' => null,
            'response' => null,
        ];

        $quest->update([
            'status' => QuestStatus::DISPUTED->value,
            'dispute' => $disputeData,
        ]);

        $recipientId = $isCreator ? $quest->worker_id : $quest->creator_id;
        if ($recipientId) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $recipientId,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Eskalasi arbitrase telah diajukan pada quest '{$quest->title}' oleh {$user->name} dengan kategori: {$categoryLabel}. Status quest dibekukan menunggu peninjauan Admin.",
                        'type' => 'quest_disputed',
                    ],
                    'read_at' => null,
                ]);
            } catch (\Throwable $e) {
                // Ignore fallback
            }
        }

        return $quest;
    }

    /**
     * Submit official response / counter-evidence by the other party.
     */
    public function respond(Quest $quest, User $user, string $responseNote, array $evidenceFiles = []): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $user->_id;
        $isWorker = (string) $quest->worker_id === (string) $user->_id;

        if (! $isCreator && ! $isWorker) {
            abort(403, 'Hanya pihak terkait kontrak yang dapat memberikan tanggapan sengketa.');
        }

        if ($quest->status !== QuestStatus::DISPUTED->value) {
            abort(400, 'Hanya quest berstatus disputed yang dapat ditanggapi.');
        }

        $dispute = $quest->dispute ?? [];

        if ((string) ($dispute['filer_id'] ?? '') === (string) $user->_id) {
            abort(400, 'Pihak pelapor tidak dapat memberikan tanggapan tandingan.');
        }

        $dispute['response'] = [
            'responder_id' => (string) $user->_id,
            'responder_name' => $user->name,
            'response_note' => trim($responseNote),
            'evidence_files' => $evidenceFiles,
            'responded_at' => now()->toIso8601String(),
        ];

        $quest->update([
            'dispute' => $dispute,
        ]);

        $filerId = $dispute['filer_id'] ?? null;
        if ($filerId) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $filerId,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Pihak lawan ({$user->name}) telah menyerahkan tanggapan resmi atas sengketa quest '{$quest->title}'. Admin akan segera memproses mediasi.",
                        'type' => 'dispute_response_submitted',
                    ],
                    'read_at' => null,
                ]);
            } catch (\Throwable $e) {
                // Ignore fallback
            }
        }

        return $quest;
    }
}
