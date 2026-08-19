<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class RequestFinalZipRevisionAction
{
    /**
     * Execute requesting revision or re-upload of the final master ZIP archive.
     */
    public function execute(User $actor, Quest $quest, string $revisionNote): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat meminta perbaikan berkas final.');
        }

        if ($quest->status !== QuestStatus::DELIVERED->value) {
            abort(400, 'Permintaan perbaikan berkas hanya dapat diajukan saat status menunggu konfirmasi berkas akhir.');
        }

        $revisions = $quest->revisions ?? [];
        $revisions[] = [
            'note' => '[Perbaikan Berkas Final ZIP] '.$revisionNote,
            'created_at' => now()->toIso8601String(),
            'author_id' => (string) $actor->_id,
            'author_name' => $actor->name,
        ];

        $quest->update([
            'status' => QuestStatus::PAYMENT->value,
            'revision_note' => $revisionNote,
            'revisions' => $revisions,
        ]);

        if ($quest->worker_id) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Pembuat quest menemukan kendala pada berkas ZIP final untuk quest '{$quest->title}' dan meminta pengunggahan ulang: '{$revisionNote}'",
                        'type' => 'delivery_revision_requested',
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
