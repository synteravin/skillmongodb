<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Quest;
use App\Models\User;

class CreateQuestAction
{
    /**
     * Execute the action to create a new Quest.
     */
    public function execute(User $creator, array $data): Quest
    {
        $status = $creator->isAdmin() ? QuestStatus::OPEN->value : QuestStatus::DRAFT->value;

        $maxBudget = (int) ($data['max_budget'] ?? $data['max_salary'] ?? 0);
        $minBudget = (int) ($data['min_budget'] ?? $data['min_salary'] ?? 0);

        if ($maxBudget >= 10000000) {
            $tier = 'S';
        } elseif ($maxBudget >= 5000000) {
            $tier = 'A';
        } elseif ($maxBudget >= 2500000) {
            $tier = 'B';
        } elseif ($maxBudget >= 1000000) {
            $tier = 'C';
        } else {
            $tier = 'D';
        }

        $avgBudget = ($minBudget + $maxBudget) / 2;

        $exp = (int) min(1000, max(100, round(100 + $avgBudget * 0.0001)));
        $gold = (int) min(500, max(50, round(50 + $maxBudget * 0.00005)));
        $rep = (int) min(200, max(20, round(20 + $avgBudget * 0.00002)));

        $calculatedRewards = [
            'exp' => $exp,
            'gold' => $gold,
            'rep' => $rep,
            'erp' => $rep,
        ];

        if (isset($data['custom_rewards']) && $data['custom_rewards']) {
            $calculatedRewards = [
                'exp' => (int) ($data['custom_rewards']['exp'] ?? $calculatedRewards['exp']),
                'gold' => (int) ($data['custom_rewards']['gold'] ?? $calculatedRewards['gold']),
                'rep' => (int) ($data['custom_rewards']['rep'] ?? $data['custom_rewards']['erp'] ?? $calculatedRewards['rep']),
                'erp' => (int) ($data['custom_rewards']['rep'] ?? $data['custom_rewards']['erp'] ?? $calculatedRewards['erp']),
            ];
        }

        return Quest::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_budget' => $minBudget,
            'max_budget' => $maxBudget,
            'min_salary' => $minBudget,
            'max_salary' => $maxBudget,
            'deadline' => now()->parse($data['deadline']),
            'status' => $status,
            'creator_id' => $creator->_id,
            'images' => $data['images'] ?? [],
            'files' => $data['files'] ?? [],
            'tier' => $tier,
            'custom_rewards' => $data['custom_rewards'] ?? null,
            'rewards' => $calculatedRewards,
            'submission_history' => [],
        ]);
    }
}
