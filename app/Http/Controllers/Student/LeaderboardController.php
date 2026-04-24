<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $users = User::with('userStats')->get();

        $leaderboard = $users->map(function ($user) {

            $totalScore = 0;

            foreach ($user->userStats as $stat) {

                if (!$stat->path_stats)
                    continue;

                $pathStats = $stat->path_stats;

                if (is_string($pathStats)) {
                    $pathStats = json_decode($pathStats, true);
                } elseif (is_object($pathStats)) {
                    $pathStats = json_decode(json_encode($pathStats), true);
                }

                foreach ($pathStats as $value) {
                    $item = (array) $value;

                    if (isset($item['quiz_score'])) {
                        $totalScore += $item['quiz_score'];
                    }
                }
            }

            return [
                'name' => $user->name,
                'avatar' => $user->avatar
                    ? asset('storage/' . $user->avatar)
                    : null,
                'total_score' => $totalScore,
            ];
        })
            ->filter(fn($u) => $u['total_score'] > 0)
            ->sortByDesc('total_score')
            ->values()
            ->take(10);

        return Inertia::render('Student/Leaderboard', [
            'leaderboard' => $leaderboard,
        ]);
    }
}