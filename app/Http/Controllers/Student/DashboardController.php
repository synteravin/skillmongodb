<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Rank;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load(['character', 'userStats']);

        // 🚫 Kalau belum punya character atau data character terhapus
        if (! $user->hasCharacter() || ! $user->character) {
            return redirect()->route('character.select');
        }

        $totalExp = 0;
        $totalGold = 0;
        $totalScore = 0;

        // =========================
        // 🔥 LOOP USER STATS (1x saja)
        // =========================
        foreach ($user->userStats as $stat) {
            $statExp = 0;
            $statGold = 0;

            if ($stat->path_stats) {
                $pathStats = $stat->path_stats;

                // Normalize Mongo
                if (is_string($pathStats)) {
                    $pathStats = json_decode($pathStats, true);
                } elseif (is_object($pathStats)) {
                    $pathStats = json_decode(json_encode($pathStats), true);
                }

                foreach ($pathStats as $value) {
                    $item = (array) $value;

                    $statExp += $item['exp'] ?? 0;
                    $statGold += $item['gold'] ?? 0;

                    if (isset($item['quiz_score'])) {
                        $totalScore += $item['quiz_score'];
                    }
                }
            }

            $totalExp += max((int) ($stat->exp ?? 0), $statExp);
            $totalGold += max((int) ($stat->gold ?? 0), $statGold);
        }

        // =========================
        // 🔥 RANK SYSTEM (ERP / Quiz Score)
        // =========================
        $ranks = Rank::orderBy('order')->get();
        $step = floor($totalScore / 500);
        $tierIndex = floor($step / 3);
        $star = ($step % 3) + 1;
        $tier = $ranks[$tierIndex] ?? $ranks->last();

        $rankData = [
            'name' => $tier->name ?? 'Unranked',
            'image' => $tier->image_url ?? '/images/romawi.png',
            'star' => (int) $star,
            'total_score' => (int) $totalScore,
            'current_score' => (int) ($totalScore % 500),
            'max_score' => 500,
        ];

        // =========================
        // 🔥 LEVEL SYSTEM (RPG)
        // =========================
        $expPerLevel = 500;

        $currentLevel = floor($totalExp / $expPerLevel) + 1;
        $currentExp = $totalExp % $expPerLevel;

        // =========================
        // 🔥 RESPONSE
        // =========================
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        try {
            $notifications = Notification::where('notifiable_id', (string) $user->_id)
                ->latest()
                ->take(15)
                ->get()
                ->map(function ($n) {
                    return [
                        'id' => (string) $n->_id,
                        'data' => $n->data,
                        'read_at' => $n->read_at ? $n->read_at->toISOString() : null,
                        'created_at' => $n->created_at ? $n->created_at->diffForHumans() : '',
                    ];
                });
        } catch (\Throwable $e) {
            $notifications = collect();
        }

        return Inertia::render('Student/Dashboard', [
            'notifications' => $notifications,
            'user' => [
                'name' => $user->name,
                'username' => $user->username ?? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $user->name)),
                'email' => $user->email,
                'role' => $user->role,

                // 🔥 RPG SYSTEM
                'level' => $currentLevel,
                'xp' => $currentExp,
                'exp_max' => $expPerLevel,

                // 🔥 RANK & ERP SYSTEM
                'rank' => $rankData,

                // 🔥 ECONOMY
                'gold' => $totalGold,

                'hasCharacter' => true,

                // 🔥 CHARACTER
                'character' => [
                    'name' => $user->character->name,
                    'avatar' => $user->character->avatar_url,
                    'backstory' => $user->character->backstory,
                ],

                // 🔥 USER AVATAR (UPLOAD)
                'avatar' => $user->avatar
                    ? $disk->url($user->avatar)
                    : null,

                'has_completed_onboarding' => (bool) ($user->has_completed_onboarding ?? false),
            ],
        ]);
    }

    public function completeOnboarding(Request $request)
    {
        $user = $request->user();
        $user->has_completed_onboarding = true;
        $user->save();

        return response()->json(['success' => true]);
    }
}
