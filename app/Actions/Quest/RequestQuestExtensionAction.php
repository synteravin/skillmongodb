<?php

namespace App\Actions\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class RequestQuestExtensionAction
{
    /**
     * Execute action for worker to request a deadline extension.
     */
    public function execute(User $worker, Quest $quest, string $proposedDeadline, string $reason): Quest
    {
        if ((string) $quest->worker_id !== (string) $worker->_id) {
            abort(403, 'Hanya pekerja yang ditunjuk yang dapat mengajukan perpanjangan tenggat waktu.');
        }

        if (! in_array($quest->status, ['ongoing', 'revision', 'submitted'])) {
            abort(400, 'Perpanjangan waktu hanya dapat diajukan saat quest berstatus aktif.');
        }

        $parsedDeadline = Carbon::parse($proposedDeadline);
        if ($parsedDeadline->isPast()) {
            abort(422, 'Tenggat waktu baru yang diusulkan harus di masa mendatang.');
        }

        $requests = $quest->resolution_requests ?? [];

        // Check if there is already a pending extension request
        foreach ($requests as $req) {
            if (($req['type'] ?? '') === 'deadline_extension' && ($req['status'] ?? '') === 'pending') {
                abort(400, 'Masih ada permohonan perpanjangan waktu yang sedang menunggu persetujuan klien.');
            }
        }

        $newRequest = [
            'id' => (string) Str::uuid(),
            'type' => 'deadline_extension',
            'requester_id' => (string) $worker->_id,
            'requester_name' => $worker->name,
            'proposed_deadline' => $parsedDeadline->toIso8601String(),
            'reason' => trim($reason),
            'status' => 'pending',
            'requested_at' => now()->toIso8601String(),
            'responded_at' => null,
            'response_note' => null,
        ];

        $requests[] = $newRequest;
        $quest->update([
            'resolution_requests' => $requests,
        ]);

        if ($quest->creator_id) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->creator_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Pekerja {$worker->name} mengajukan permohonan perpanjangan tenggat waktu quest '{$quest->title}' hingga {$parsedDeadline->isoFormat('D MMMM Y')}. Silakan tinjau di Pusat Resolusi.",
                        'type' => 'extension_requested',
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
