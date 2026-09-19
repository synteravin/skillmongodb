<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadQuestDownPaymentProofAction
{
    /**
     * Execute uploading down payment (DP) proof receipt.
     */
    public function execute(User $actor, Quest $quest, UploadedFile $dpProofFile): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat mengunggah bukti transfer DP.');
        }

        if ($quest->status !== QuestStatus::DOWN_PAYMENT->value) {
            abort(400, 'Bukti transfer DP hanya dapat diunggah saat status quest dalam tahap pembayaran awal.');
        }

        $path = $dpProofFile->store('quests/down_payments', 's3');

        $dpProof = [
            'name' => $dpProofFile->getClientOriginalName(),
            'path' => $path,
            'size' => $dpProofFile->getSize(),
        ];

        $quest->update([
            'dp_proof' => $dpProof,
            'dp_uploaded_at' => now(),
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
                        'message' => "Pembuat quest '{$quest->title}' telah mengunggah bukti transfer uang muka (DP). Silakan periksa rekening Anda dan konfirmasi penerimaan DP untuk memulai pengerjaan.",
                        'type' => 'dp_uploaded',
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
