<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class ConfirmQuestDownPaymentAction
{
    public function __construct(
        protected RecordQuestTransactionAction $recordQuestTransactionAction
    ) {}

    /**
     * Execute worker confirming receipt of down payment (DP), transitioning to ongoing.
     */
    public function execute(User $actor, Quest $quest): Quest
    {
        $isWorker = (string) $quest->worker_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isWorker && ! $isAdmin) {
            abort(403, 'Hanya pekerja terpilih atau admin yang dapat mengonfirmasi penerimaan DP.');
        }

        if ($quest->status !== QuestStatus::DOWN_PAYMENT->value) {
            abort(400, 'Quest harus berada dalam tahap pembayaran awal untuk dikonfirmasi.');
        }

        if (empty($quest->dp_proof)) {
            abort(400, 'Bukti transfer pembayaran awal belum diunggah oleh pembuat quest.');
        }

        $quest->update([
            'status' => QuestStatus::ONGOING->value,
            'dp_confirmed_at' => now(),
        ]);

        $dpAmount = (int) ($quest->dp_amount ?? 0);
        if ($dpAmount > 0 && $quest->worker_id) {
            $this->recordQuestTransactionAction->execute(
                (string) $quest->_id,
                (string) $quest->worker_id,
                $dpAmount,
                'p2p_dp_payment',
                "Penerimaan pembayaran awal (DP) quest: {$quest->title} senilai Rp ".number_format($dpAmount, 0, ',', '.')
            );
        }

        if ($quest->creator_id) {
            try {
                $workerName = $actor->name;
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->creator_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Pekerja '{$workerName}' telah mengonfirmasi penerimaan uang muka (DP) untuk quest '{$quest->title}'. Pengerjaan proyek resmi dimulai!",
                        'type' => 'dp_confirmed',
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
