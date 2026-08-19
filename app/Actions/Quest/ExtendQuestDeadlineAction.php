<?php

namespace App\Actions\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class ExtendQuestDeadlineAction
{
    /**
     * Execute extending the quest completion deadline.
     */
    public function execute(User $actor, Quest $quest, string $newDeadline): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat memperpanjang tenggat waktu.');
        }

        $parsedDeadline = now()->parse($newDeadline);

        $updateData = [
            'deadline' => $parsedDeadline,
        ];

        if ($quest->status === 'expired') {
            $updateData['status'] = empty($quest->worker_id) ? 'open' : 'ongoing';
        }

        $quest->update($updateData);

        if ($quest->worker_id) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Tenggat waktu pengerjaan untuk quest '{$quest->title}' telah diperpanjang hingga {$parsedDeadline->translatedFormat('d F Y H:i')}.",
                        'type' => 'deadline_extended',
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
