<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class RequestQuestRevisionAction
{
    /**
     * Execute requesting revision on submitted work by creator or admin.
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

        // Update rounds structure
        $rounds = $quest->rounds ?? [];
        if (is_string($rounds)) {
            $rounds = json_decode($rounds, true) ?: [];
        }
        if (is_array($rounds) && ! empty($rounds)) {
            $lastIndex = count($rounds) - 1;
            $rounds[$lastIndex]['status'] = 'changes_requested';
            $rounds[$lastIndex]['review'] = [
                'reviewed_at' => now()->toIso8601String(),
                'reviewer_id' => (string) $actor->_id,
                'reviewer_name' => $actor->name,
                'status' => 'changes_requested',
                'note' => $data['revision_note'],
            ];
        }

        $quest->update([
            'status' => QuestStatus::REVISION->value,
            'revision_note' => $data['revision_note'],
            'revisions' => $revisions,
            'rounds' => $rounds,
        ]);

        if ($quest->worker_id) {
            try {
                $roleLabel = $isAdmin ? 'Admin' : 'Pembuat quest';
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "{$roleLabel} meminta perbaikan/revisi hasil pekerjaan pada quest '{$quest->title}': '{$data['revision_note']}'",
                        'type' => 'revision_requested',
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
