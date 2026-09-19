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
     * @param  array{rating?: int|null, rating_comment?: string|null}  $data
     */
    public function execute(User $actor, Quest $quest, array $data = []): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat menyetujui hasil pekerjaan.');
        }

        if ($quest->status !== QuestStatus::SUBMITTED->value) {
            abort(400, 'Quest harus dalam status menunggu tinjauan untuk dapat disetujui.');
        }

        $rounds = $quest->rounds ?? [];
        if (is_string($rounds)) {
            $rounds = json_decode($rounds, true) ?: [];
        }
        if (is_array($rounds) && ! empty($rounds)) {
            $lastIndex = count($rounds) - 1;
            $rounds[$lastIndex]['status'] = 'approved';
            $rounds[$lastIndex]['review'] = [
                'reviewed_at' => now()->toIso8601String(),
                'reviewer_id' => (string) $actor->_id,
                'reviewer_name' => $actor->name,
                'status' => 'approved',
                'note' => null,
            ];
        }

        $updateData = [
            'status' => QuestStatus::APPROVED->value,
            'revision_note' => null,
            'rounds' => $rounds,
        ];

        if (isset($data['rating'])) {
            $updateData['rating'] = (int) $data['rating'];
            $updateData['rating_comment'] = $data['rating_comment'] ?? null;
        }

        $quest->update($updateData);

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
                        'message' => "Hasil pekerjaan Anda untuk quest '{$quest->title}' telah disetujui oleh {$approverRole}! Menunggu bukti transfer pembayaran.",
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
