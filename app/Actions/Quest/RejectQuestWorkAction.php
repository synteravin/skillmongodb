<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class RejectQuestWorkAction
{
    /**
     * Execute rejection/revision request of submitted work by creator or admin.
     *
     * @param  array{revision_note: string}  $data
     */
    public function execute(User $actor, Quest $quest, array $data): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat meminta revisi pekerjaan.');
        }

        if ($quest->status !== QuestStatus::SUBMITTED->value) {
            abort(400, 'Quest harus dalam status menunggu tinjauan untuk dapat meminta revisi.');
        }

        $revisions = $quest->revisions ?? [];
        $revisions[] = [
            'note' => $data['revision_note'],
            'created_at' => now()->toIso8601String(),
            'author_id' => (string) $actor->_id,
            'author_name' => $actor->name,
        ];

        $quest->update([
            'status' => QuestStatus::ONGOING->value,
            'revision_note' => $data['revision_note'],
            'revisions' => $revisions,
        ]);

        if ($quest->worker_id) {
            try {
                $roleLabel = $isAdmin ? 'Admin' : 'Pembuat lowongan';
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "{$roleLabel} meminta revisi hasil pekerjaan pada quest '{$quest->title}': '{$data['revision_note']}'",
                        'type' => 'work_rejected',
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
