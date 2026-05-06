<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        // =========================
        // 🔥 LOOP USER STATS (1x saja)
        // =========================
        foreach ($user->userStats as $stat) {

            if (! $stat->path_stats) {
                continue;
            }

            $pathStats = $stat->path_stats;

            // Normalize Mongo
            if (is_string($pathStats)) {
                $pathStats = json_decode($pathStats, true);
            } elseif (is_object($pathStats)) {
                $pathStats = json_decode(json_encode($pathStats), true);
            }

            foreach ($pathStats as $value) {
                $item = (array) $value;

                $totalExp += $item['exp'] ?? 0;
                $totalGold += $item['gold'] ?? 0;
            }
        }

        // =========================
        // 🔥 LEVEL SYSTEM (RPG)
        // =========================
        $expPerLevel = 500;

        $currentLevel = floor($totalExp / $expPerLevel) + 1;
        $currentExp = $totalExp % $expPerLevel;

        // =========================
        // 🔥 RESPONSE
        // =========================
        return Inertia::render('Student/Dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,

                // 🔥 RPG SYSTEM
                'level' => $currentLevel,
                'xp' => $currentExp,
                'exp_max' => $expPerLevel,

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
                    ? asset('storage/'.$user->avatar)
                    : null,
            ],
        ]);
    }
}
