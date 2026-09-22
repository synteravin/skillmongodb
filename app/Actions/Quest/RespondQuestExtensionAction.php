<?php

namespace App\Actions\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class RespondQuestExtensionAction
{
    /**
     * Execute action for creator to respond to an extension request.
     */
    public function execute(User $creator, Quest $quest, string $requestId, bool $accept, ?string $responseNote = null): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $creator->_id;
        $isAdmin = $creator->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat merespons permohonan perpanjangan waktu.');
        }

        $requests = $quest->resolution_requests ?? [];
        $found = false;
        $proposedDeadline = null;

        foreach ($requests as &$req) {
            if (($req['id'] ?? '') === $requestId && ($req['status'] ?? '') === 'pending') {
                $found = true;
                $req['status'] = $accept ? 'accepted' : 'rejected';
                $req['responded_at'] = now()->toIso8601String();
                $req['response_note'] = $responseNote ? trim($responseNote) : null;
                $proposedDeadline = $req['proposed_deadline'] ?? null;
                break;
            }
        }

        if (! $found) {
            abort(404, 'Permohonan perpanjangan waktu tidak ditemukan atau sudah direspons.');
        }

        $updateData = [
            'resolution_requests' => $requests,
        ];

        if ($accept && $proposedDeadline) {
            $updateData['deadline'] = Carbon::parse($proposedDeadline);
        }

        $quest->update($updateData);

        if ($quest->worker_id) {
            try {
                $decisionText = $accept ? 'disetujui' : 'ditolak';
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Permohonan perpanjangan tenggat waktu untuk quest '{$quest->title}' telah {$decisionText} oleh pembuat quest.".($responseNote ? " Catatan: {$responseNote}" : ''),
                        'type' => $accept ? 'extension_accepted' : 'extension_rejected',
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
