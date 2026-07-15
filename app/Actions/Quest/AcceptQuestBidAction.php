<?php

namespace App\Actions\Quest;

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
        $acceptedBid->update(['status' => 'accepted']);

        // Reject all other bids for this quest
        QuestBid::where('quest_id', $quest->_id)
            ->where('_id', '!=', $bidId)
            ->update(['status' => 'rejected']);

        // Update quest worker and status
        $quest->update([
            'status' => 'ongoing',
            'worker_id' => $acceptedBid->student_id,
        ]);
    }
}
