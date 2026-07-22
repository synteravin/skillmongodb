<?php

namespace App\Actions\Quest;

use App\Enums\QuestBidStatus;
use App\Models\Notification;
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
        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $student->_id,
            'bid_amount' => (int) $data['bid_amount'],
            'cv' => $data['cv'],
            'portfolio' => $data['portfolio'],
            'proposal' => $data['proposal'],
            'status' => QuestBidStatus::PENDING->value,
        ]);

        if ($quest->creator_id) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->creator_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'title' => $quest->title,
                        'message' => "Pelamar '{$student->name}' telah mengajukan proposal penawaran baru (Rp ".number_format((int) $data['bid_amount'], 0, ',', '.').") untuk quest '{$quest->title}'. Silakan tinjau proposal tersebut.",
                        'type' => 'bid_received',
                    ],
                    'read_at' => null,
                ]);
            } catch (\Throwable $e) {
                // Ignored for DB fallback
            }
        }

        return $bid;
    }
}
