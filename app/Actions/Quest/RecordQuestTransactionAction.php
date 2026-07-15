<?php

namespace App\Actions\Quest;

use App\Models\QuestTransaction;
use App\Models\User;
use App\Models\UserStat;

class RecordQuestTransactionAction
{
    /**
     * Record a transaction and adjust the target user's Gold balance.
     */
    public function execute(string $questId, string $userId, int $amount, string $type, string $description): QuestTransaction
    {
        $transaction = QuestTransaction::create([
            'quest_id' => $questId,
            'user_id' => $userId,
            'amount' => $amount,
            'type' => $type,
            'description' => $description,
        ]);

        $user = User::find($userId);
        if ($user) {
            $userStat = UserStat::firstOrCreate([
                'user_id' => $userId,
                'course_id' => 'quest_rewards',
            ], [
                'completed_modules' => [],
                'completed_paths' => [],
                'exp' => 0,
                'gold' => 0,
                'erp' => 0,
                'level' => 1,
                'path_stats' => [],
            ]);

            $currentGold = (int) ($userStat->gold ?? 0);
            $userStat->gold = max(0, $currentGold + $amount);
            $userStat->save();
        }

        return $transaction;
    }
}
