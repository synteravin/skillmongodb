<?php

namespace App\Actions\Quest;

use App\Enums\DisputeStatus;
use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;

class FileQuestDisputeAction
{
    /**
     * Execute the action to file a dispute for the quest.
     */
    public function execute(Quest $quest, User $user, string $reason): void
    {
        $currentStatus = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;

        if (! in_array($currentStatus, [QuestStatus::SUBMITTED->value, QuestStatus::ONGOING->value, QuestStatus::APPROVED->value])) {
            abort(400, 'Quest tidak dalam status aktif atau peninjauan untuk diajukan dispute.');
        }

        $quest->update([
            'status' => QuestStatus::DISPUTED->value,
            'dispute' => [
                'disputed_at' => now()->toIso8601String(),
                'disputer_id' => $user->_id,
                'filer_id' => $user->_id,
                'filer_name' => $user->name,
                'reason' => $reason,
                'status' => DisputeStatus::PENDING->value,
                'resolved_at' => null,
                'ruled_at' => null,
                'ruling_note' => null,
                'note' => null,
                'ruling' => null,
            ],
        ]);

        if ($quest->creator_id) {
            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $quest->creator_id,
                'data' => [
                    'quest_id' => $quest->_id,
                    'title' => $quest->title,
                    'message' => "Perselisihan (dispute) telah diajukan pada quest '{$quest->title}' oleh {$user->name}. Status ditangguhkan menunggu keputusan Admin.",
                    'type' => 'quest_disputed',
                ],
                'read_at' => null,
            ]);
        }

        if ($quest->worker_id && $quest->worker_id !== $user->_id) {
            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $quest->worker_id,
                'data' => [
                    'quest_id' => $quest->_id,
                    'title' => $quest->title,
                    'message' => "Perselisihan (dispute) telah diajukan pada quest '{$quest->title}' oleh {$user->name}. Status ditangguhkan menunggu keputusan Admin.",
                    'type' => 'quest_disputed',
                ],
                'read_at' => null,
            ]);
        }
    }
}
