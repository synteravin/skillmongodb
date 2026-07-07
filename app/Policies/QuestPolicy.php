<?php

namespace App\Policies;

use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;

class QuestPolicy extends BasePolicy
{
    /**
     * Determine if the user can bid on the quest.
     */
    public function bid(User $user, Quest $quest): bool
    {
        // Only students can bid
        if (! $user->isStudent()) {
            return false;
        }

        // Creator cannot bid on their own quest
        if ($quest->creator_id === $user->_id) {
            return false;
        }

        // Must be open
        if ($quest->status !== 'open') {
            return false;
        }

        // Hasn't bid yet
        $alreadyBid = QuestBid::where('quest_id', $quest->_id)
            ->where('student_id', $user->_id)
            ->exists();

        return ! $alreadyBid;
    }

    /**
     * Determine if the user can accept a bid on the quest.
     */
    public function acceptBid(User $user, Quest $quest): bool
    {
        if ($user->isAdmin()) {
            return $quest->status === 'open';
        }

        return $quest->creator_id === $user->_id && $quest->status === 'open';
    }

    /**
     * Determine if the user can modify the quest.
     */
    public function update(User $user, Quest $quest): bool
    {
        if ($user->isAdmin()) {
            return $quest->status === 'open';
        }

        return $quest->creator_id === $user->_id && $quest->status === 'open';
    }
}
