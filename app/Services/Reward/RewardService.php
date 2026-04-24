<?php

namespace App\Services\Reward;

use App\Models\UserStat;

class RewardService
{
    private function normalizeStats($stats)
    {
        if (is_object($stats)) {
            return (array) $stats;
        }

        return $stats ?? [];
    }

    private function initPath(&$stats, $pathId)
    {
        if (!is_array($stats)) {
            $stats = [];
        }

        if (!isset($stats[$pathId])) {
            $stats[$pathId] = [
                'exp' => 0,
                'gold' => 0,
                'quiz_score' => 0,
            ];
        }
    }

    public function addExp(UserStat $progress, $pathId, int $amount)
    {
        $stats = $this->normalizeStats($progress->path_stats);
        $pathId = (string) $pathId;

        $this->initPath($stats, $pathId);

        $stats[$pathId]['exp'] += $amount;

        $progress->path_stats = $stats;
        $progress->save();
    }

    public function addGold(UserStat $progress, $pathId, int $amount)
    {
        $stats = $this->normalizeStats($progress->path_stats);
        $pathId = (string) $pathId;

        $this->initPath($stats, $pathId);

        $stats[$pathId]['gold'] += $amount;

        $progress->path_stats = $stats;
        $progress->save();
    }

    public function setQuizScore(UserStat $progress, $pathId, int $score)
    {
        $stats = $this->normalizeStats($progress->path_stats);
        $pathId = (string) $pathId;

        $this->initPath($stats, $pathId);

        $stats[$pathId]['quiz_score'] = max(
            $stats[$pathId]['quiz_score'],
            $score
        );

        $progress->path_stats = $stats;
        $progress->save();
    }
}