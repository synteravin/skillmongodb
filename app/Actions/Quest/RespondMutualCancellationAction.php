<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class RespondMutualCancellationAction
{
    /**
     * Execute action to respond to a mutual cancellation request.
     */
    public function execute(User $actor, Quest $quest, string $requestId, bool $accept, ?string $responseNote = null): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isWorker = (string) $quest->worker_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isWorker && ! $isAdmin) {
            abort(403, 'Anda tidak memiliki hak akses untuk merespons permohonan ini.');
        }

        $requests = $quest->resolution_requests ?? [];
        $targetRequest = null;
        $targetIndex = null;

        foreach ($requests as $idx => &$req) {
            if (($req['id'] ?? '') === $requestId && ($req['status'] ?? '') === 'pending') {
                if ((string) ($req['requester_id'] ?? '') === (string) $actor->_id && ! $isAdmin) {
                    abort(400, 'Anda tidak dapat merespons permohonan yang Anda ajukan sendiri.');
                }
                $targetRequest = $req;
                $targetIndex = $idx;
                $req['status'] = $accept ? 'accepted' : 'rejected';
                $req['responded_at'] = now()->toIso8601String();
                $req['response_note'] = $responseNote ? trim($responseNote) : null;
                break;
            }
        }

        if ($targetRequest === null) {
            abort(404, 'Permohonan pembatalan tidak ditemukan atau sudah direspons.');
        }

        $updateData = [
            'resolution_requests' => $requests,
        ];

        if ($accept) {
            $dpHandling = $targetRequest['dp_handling'] ?? 'refund_creator';
            $splitPercentage = $targetRequest['split_percentage'] ?? null;

            $updateData['status'] = QuestStatus::CANCELLED->value;
            $updateData['completed_at'] = now();
            $updateData['dispute'] = [
                'status' => 'resolved_cancelled',
                'ruling' => 'mutual_cancellation',
                'reason' => $targetRequest['reason'] ?? 'Pembatalan sepakat',
                'note' => "Kontrak ditutup secara damai atas kesepakatan bersama kedua belah pihak. Ketentuan DP: {$dpHandling}.".($responseNote ? " Catatan: {$responseNote}" : ''),
                'dp_handling' => $dpHandling,
                'split_percentage' => $splitPercentage,
                'resolved_at' => now()->toIso8601String(),
                'ruled_at' => now()->toIso8601String(),
                'filer_name' => $targetRequest['requester_name'] ?? 'User',
            ];
        }

        $quest->update($updateData);

        $requesterId = $targetRequest['requester_id'] ?? null;
        if ($requesterId) {
            try {
                $decisionText = $accept ? 'disetujui dan kontrak telah resmi ditutup secara damai' : 'ditolak oleh pihak lawan';
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $requesterId,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Permohonan pembatalan damai untuk quest '{$quest->title}' telah {$decisionText}.".($responseNote ? " Catatan: {$responseNote}" : ''),
                        'type' => $accept ? 'cancellation_accepted' : 'cancellation_rejected',
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
