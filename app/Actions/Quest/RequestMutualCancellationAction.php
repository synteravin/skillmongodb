<?php

namespace App\Actions\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class RequestMutualCancellationAction
{
    /**
     * Execute action to propose a mutual cancellation agreement.
     */
    public function execute(User $actor, Quest $quest, string $reason, string $dpHandling = 'refund_creator', ?int $splitPercentage = null): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isWorker = (string) $quest->worker_id === (string) $actor->_id;

        if (! $isCreator && ! $isWorker) {
            abort(403, 'Hanya pembuat quest atau pekerja terkait yang dapat mengajukan permohonan pembatalan.');
        }

        if (! in_array($quest->status, ['down_payment', 'ongoing', 'revision', 'submitted'])) {
            abort(400, 'Permohonan pembatalan hanya dapat diajukan saat quest masih dalam proses.');
        }

        $requests = $quest->resolution_requests ?? [];

        foreach ($requests as $req) {
            if (($req['type'] ?? '') === 'mutual_cancellation' && ($req['status'] ?? '') === 'pending') {
                abort(400, 'Masih ada permohonan pembatalan yang sedang menunggu respons pihak lawan.');
            }
        }

        $newRequest = [
            'id' => (string) Str::uuid(),
            'type' => 'mutual_cancellation',
            'requester_id' => (string) $actor->_id,
            'requester_name' => $actor->name,
            'reason' => trim($reason),
            'dp_handling' => in_array($dpHandling, ['refund_creator', 'keep_worker', 'split']) ? $dpHandling : 'refund_creator',
            'split_percentage' => $splitPercentage ? (int) $splitPercentage : null,
            'status' => 'pending',
            'requested_at' => now()->toIso8601String(),
            'responded_at' => null,
            'response_note' => null,
        ];

        $requests[] = $newRequest;
        $quest->update([
            'resolution_requests' => $requests,
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
                        'message' => "{$actor->name} mengajukan permohonan pembatalan kesepakatan secara damai untuk quest '{$quest->title}'. Silakan tinjau di Pusat Resolusi.",
                        'type' => 'cancellation_requested',
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
