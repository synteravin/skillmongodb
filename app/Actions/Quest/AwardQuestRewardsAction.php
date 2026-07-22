<?php

namespace App\Actions\Quest;

use App\Models\Quest;
use App\Models\UserStat;

class AwardQuestRewardsAction
{
    public function __construct(
        protected RecordQuestTransactionAction $recordTransactionAction
    ) {}

    /**
     * Execute the action to award quest rewards to the worker.
     */
    public function execute(Quest $quest, string $workerId): void
    {
        $progress = UserStat::firstOrCreate([
            'user_id' => $workerId,
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

        $pathStats = $progress->path_stats ?? [];
        if (is_string($pathStats)) {
            $pathStats = json_decode($pathStats, true) ?: [];
        } else {
            $pathStats = (array) $pathStats;
        }

        $questKey = (string) $quest->_id;
        if (isset($pathStats[$questKey])) {
            return;
        }

        $rewards = $this->getRewardsForQuest($quest);

        $pathStats[$questKey] = [
            'exp' => $rewards['exp'],
            'gold' => $rewards['gold'],
            'quiz_score' => $rewards['erp'], // quiz_score represents ERP
        ];

        $progress->path_stats = $pathStats;

        $progress->exp = (int) ($progress->exp ?? 0) + $rewards['exp'];
        $progress->erp = (int) ($progress->erp ?? 0) + $rewards['erp'];
        $progress->level = (int) max(($progress->level ?? 1), floor($progress->exp / 500) + 1);

        $progress->save();

        // Record Gold transaction: release_payout to worker
        $this->recordTransactionAction->execute($quest->_id, $workerId, $rewards['gold'], 'release_payout', "Escrow payout release for quest completion: {$quest->title}");
    }

    /**
     * Helper to get rewards for the quest.
     */
    public function getRewardsForQuest(Quest $quest): array
    {
        if ($quest->rewards) {
            return [
                'exp' => (int) ($quest->rewards['exp'] ?? 250),
                'gold' => (int) ($quest->rewards['gold'] ?? 150),
                'erp' => (int) ($quest->rewards['erp'] ?? 100),
            ];
        }

        if ($quest->custom_rewards) {
            return [
                'exp' => (int) ($quest->custom_rewards['exp'] ?? 250),
                'gold' => (int) ($quest->custom_rewards['gold'] ?? 150),
                'erp' => (int) ($quest->custom_rewards['erp'] ?? 100),
            ];
        }

        $maxBudget = (int) ($quest->max_budget ?? $quest->max_salary ?? 0);
        $minBudget = (int) ($quest->min_budget ?? $quest->min_salary ?? 0);
        $avgBudget = ($minBudget + $maxBudget) / 2;

        $exp = (int) min(1000, max(100, round(100 + $avgBudget * 0.0001)));
        $gold = (int) min(500, max(50, round(50 + $maxBudget * 0.00005)));
        $erp = (int) min(200, max(20, round(20 + $avgBudget * 0.00002)));

        return [
            'exp' => $exp,
            'gold' => $gold,
            'erp' => $erp,
        ];
    }
}
