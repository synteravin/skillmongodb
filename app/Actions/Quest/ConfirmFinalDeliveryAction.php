<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Str;

class ConfirmFinalDeliveryAction
{
    public function __construct(
        protected AwardQuestRewardsAction $awardQuestRewardsAction,
        protected RecordQuestTransactionAction $recordQuestTransactionAction
    ) {}

    /**
     * Execute final delivery confirmation and completion of the quest.
     */
    public function execute(User $actor, Quest $quest): Quest
    {
        $isCreator = (string) $quest->creator_id === (string) $actor->_id;
        $isAdmin = $actor->isAdmin();

        if (! $isCreator && ! $isAdmin) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat mengonfirmasi berkas akhir.');
        }

        if ($quest->status !== QuestStatus::DELIVERED->value) {
            abort(400, 'Quest harus dalam status menunggu konfirmasi berkas akhir.');
        }

        $quest->update([
            'status' => QuestStatus::COMPLETED->value,
            'completed_at' => now(),
            'payment_confirmed_at' => now(),
        ]);

        if ($quest->worker_id) {
            // Award EXP and Gold rewards
            $this->awardQuestRewardsAction->execute($quest, (string) $quest->worker_id);

            // Record transaction ledger log (in real contract Rupiah)
            $contractAmount = (int) ($quest->accepted_bid_amount ?? $quest->max_budget);
            $this->recordQuestTransactionAction->execute(
                (string) $quest->_id,
                (string) $quest->worker_id,
                $contractAmount,
                'p2p_contract_settlement',
                "Penyelesaian kontrak p2p quest: {$quest->title} senilai Rp ".number_format($contractAmount, 0, ',', '.')
            );
        }

        // Notify Worker & Creator
        try {
            if ($quest->worker_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->worker_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Selamat! Pembuat quest telah mengonfirmasi berkas final untuk quest '{$quest->title}'. Seluruh rangkaian quest resmi selesai dan hadiah telah diterima!",
                        'type' => 'quest_completed',
                    ],
                    'read_at' => null,
                ]);
            }
            if ($quest->creator_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->creator_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Anda telah mengonfirmasi berkas final untuk quest '{$quest->title}'. Quest resmi selesai!",
                        'type' => 'quest_completed',
                    ],
                    'read_at' => null,
                ]);
            }
        } catch (\Throwable $e) {
            // Ignore fallback
        }

        return $quest;
    }
}
