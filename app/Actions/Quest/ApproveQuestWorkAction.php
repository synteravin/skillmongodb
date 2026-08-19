<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class ApproveQuestWorkAction
{
    /**
     * Execute approval of submitted work by creator or admin.
     *
     * @param  array{rating: int, rating_comment?: string|null}  $data
     */
    public function execute(User $actor, Quest $quest, array $data): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat menyetujui hasil pekerjaan.');
        }

        if ($quest->status !== QuestStatus::SUBMITTED->value) {
            abort(400, 'Quest harus dalam status menunggu tinjauan untuk dapat disetujui.');
        }

        $quest->update([
            'status' => QuestStatus::APPROVED->value,
            'rating' => (int) $data['rating'],
            'rating_comment' => $data['rating_comment'] ?? null,
            'revision_note' => null,
        ]);

        if ($quest->worker_id) {
            try {
                $approverRole = $isAdmin ? 'Admin' : 'Pembuat quest';
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Hasil pekerjaan Anda untuk quest '{$quest->title}' telah disetujui oleh {$approverRole} ({$data['rating']}/5⭐)! Menunggu bukti transfer pembayaran.",
                        'type' => 'work_approved',
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
