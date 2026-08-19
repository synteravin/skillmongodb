<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadQuestPaymentProofAction
{
    /**
     * Execute uploading payment proof receipt.
     */
    public function execute(User $actor, Quest $quest, UploadedFile $paymentProofFile): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat mengunggah bukti transfer.');
        }

        if ($quest->status !== QuestStatus::APPROVED->value) {
            abort(400, 'Bukti transfer hanya dapat diunggah setelah hasil pekerjaan disetujui.');
        }

        $path = $paymentProofFile->store('quests/payments', 's3');

        $paymentProof = [
            'name' => $paymentProofFile->getClientOriginalName(),
            'path' => $path,
            'size' => $paymentProofFile->getSize(),
        ];

        $quest->update([
            'payment_proof' => $paymentProof,
            'payment_uploaded_at' => now(),
            'status' => QuestStatus::PAYMENT->value,
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
                        'message' => "Pembuat quest '{$quest->title}' telah mengunggah bukti transfer pembayaran. Silakan periksa rekening Anda dan unggah berkas ZIP final.",
                        'type' => 'payment_uploaded',
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
