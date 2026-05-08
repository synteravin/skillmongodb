<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Rank;
use App\Models\User;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $users = User::with('userStats')->get();

        // 🔥 ambil semua rank dari DB (urutan penting)
        $ranks = Rank::orderBy('order')->get();

        $leaderboard = $users->map(function ($user) use ($ranks) {

            $totalScore = 0;

            foreach ($user->userStats as $stat) {

                if (! $stat->path_stats) {
                    continue;
                }

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

            // =========================
            // 🔥 RANK LOGIC
            // =========================

            $scorePerStar = 500;

            $level = floor($totalScore / $scorePerStar); // total tier
            $star = ($level % 3) + 1; // 1 - 3
            $rankIndex = floor($level / 3);

            $rank = $ranks[$rankIndex] ?? $ranks->last();

            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = \Illuminate\Support\Facades\Storage::disk('s3');

            return [
                'name' => $user->name,

                'avatar' => $user->avatar
                    ? (str_starts_with($user->avatar, 'http') ? $user->avatar : $disk->url($user->avatar))
                    : asset('images/aizen.jpeg'),
                'total_score' => $totalScore,

                'rank' => [
                    'name' => $rank->name ?? 'Unknown',
                    'image' => $rank->image_url ?? null,
                    'star' => $star,
                ],
            ];
        })
            ->filter(fn ($u) => $u['total_score'] > 0)
            ->sortByDesc('total_score')
            ->values()
            ->take(10);

        return Inertia::render('Student/Leaderboard', [
            'leaderboard' => $leaderboard,
        ]);
    }
}
