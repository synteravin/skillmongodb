<?php

namespace App\Actions\Quest;

use App\Enums\QuestBidStatus;
use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;

class AcceptQuestBidAction
{
    /**
     * Execute the action to accept a bid on a quest (and reject all other bids).
     */
    public function execute(User $creator, Quest $quest, string $bidId): void
    {
        $acceptedBid = QuestBid::findOrFail($bidId);

        if ($acceptedBid->quest_id !== $quest->_id) {
            abort(400, 'Bid tidak cocok dengan Quest ini.');
        }

        // Accept the chosen bid
        $acceptedBid->update(['status' => QuestBidStatus::ACCEPTED->value]);

        // Notify the accepted worker
        Notification::create([
            'notifiable_type' => User::class,
            'notifiable_id' => (string) $acceptedBid->student_id,
            'data' => [
                'quest_id' => (string) $quest->_id,
                'title' => $quest->title,
                'message' => "Selamat! Proposal Anda untuk quest '{$quest->title}' telah diterima oleh pemilik proyek. Silakan mulai pengerjaan.",
                'type' => 'bid_accepted',
            ],
            'read_at' => null,
        ]);

        // Reject all other bids for this quest and notify applicants
        $otherBids = QuestBid::where('quest_id', $quest->_id)
            ->where('_id', '!=', $bidId)
            ->get();

        foreach ($otherBids as $rejectedBid) {
            $rejectedBid->update(['status' => QuestBidStatus::REJECTED->value]);

            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => (string) $rejectedBid->student_id,
                'data' => [
                    'quest_id' => (string) $quest->_id,
                    'title' => $quest->title,
                    'message' => "Terima kasih atas penawaran Anda. Pemilik proyek telah memilih pelamar lain untuk quest '{$quest->title}'.",
                    'type' => 'bid_rejected',
                ],
                'read_at' => null,
            ]);
        }

        // Update quest worker and status
        $quest->update([
            'status' => QuestStatus::ONGOING->value,
            'worker_id' => (string) $acceptedBid->student_id,
        ]);
    }
}
