<?php

namespace App\Actions\Quest;

use App\Models\Quest;
use App\Models\User;

class CreateQuestAction
{
    /**
     * Execute the action to create a new Quest.
     */
    public function execute(User $creator, array $data): Quest
    {
        $status = $creator->isAdmin() ? 'open' : 'draft';

        $maxSalary = (int) $data['max_salary'];
        $minSalary = (int) $data['min_salary'];

        if ($maxSalary >= 10000000) {
            $tier = 'S';
        } elseif ($maxSalary >= 5000000) {
            $tier = 'A';
        } elseif ($maxSalary >= 2500000) {
            $tier = 'B';
        } elseif ($maxSalary >= 1000000) {
            $tier = 'C';
        } else {
            $tier = 'D';
        }

        $avgBudget = ($minSalary + $maxSalary) / 2;

        $exp = (int) min(1000, max(100, round(100 + $avgBudget * 0.0001)));
        $gold = (int) min(500, max(50, round(50 + $maxSalary * 0.00005)));
        $erp = (int) min(200, max(20, round(20 + $avgBudget * 0.00002)));

        $calculatedRewards = [
            'exp' => $exp,
            'gold' => $gold,
            'erp' => $erp,
        ];

        if (isset($data['custom_rewards']) && $data['custom_rewards']) {
            $calculatedRewards = [
                'exp' => (int) ($data['custom_rewards']['exp'] ?? $calculatedRewards['exp']),
                'gold' => (int) ($data['custom_rewards']['gold'] ?? $calculatedRewards['gold']),
                'erp' => (int) ($data['custom_rewards']['erp'] ?? $calculatedRewards['erp']),
            ];
        }

        return Quest::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_salary' => $minSalary,
            'max_salary' => $maxSalary,
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
