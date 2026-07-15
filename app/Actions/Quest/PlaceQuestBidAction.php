<?php

namespace App\Actions\Quest;

use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;

class PlaceQuestBidAction
{
    /**
     * Execute the action to submit a bid/application for a quest.
     */
    public function execute(User $student, Quest $quest, array $data): QuestBid
    {
        return QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $student->_id,
            'bid_amount' => (int) $data['bid_amount'],
            'cv' => $data['cv'],
            'portfolio' => $data['portfolio'],
            'proposal' => $data['proposal'],
            'status' => 'pending',
        ]);
    }
}
