<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\Rank;
use App\Models\UserStat;
use Carbon\Carbon;
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

        // =========================
        // 🔥 ACTIVE DISPUTES & ARBITRATION
        // =========================
        $activeDisputes = Quest::where(function ($q) use ($user) {
            $q->where('creator_id', (string) $user->_id)
                ->orWhere('worker_id', (string) $user->_id);
        })
            ->where('status', 'disputed')
            ->get()
            ->map(function ($quest) use ($user) {
                $isClient = (string) $quest->creator_id === (string) $user->_id;
                $dispute = $quest->dispute ?? [];

                $evidenceDeadline = isset($dispute['evidence_deadline']) ? Carbon::parse($dispute['evidence_deadline']) : null;
                $slaHoursRemaining = $evidenceDeadline ? max(0, (int) now()->diffInHours($evidenceDeadline, false)) : 48;

                $phaseLabels = [
                    'fase_1_negosiasi' => 'Fase 1: Negosiasi Mandiri',
                    'fase_2_bukti' => 'Fase 2: Pengajuan Bukti',
                    'fase_3_penyelidikan' => 'Fase 3: Penyelidikan Tripartit',
                    'fase_4_putusan' => 'Fase 4: Putusan Eksekutif Admin',
                ];

                return [
                    'id' => (string) $quest->_id,
                    'slug' => $quest->slug ?: (string) $quest->_id,
                    'title' => $quest->title,
                    'role' => $isClient ? 'client' : 'worker',
                    'status' => $quest->status,
                    'phase' => $phaseLabels[$dispute['phase'] ?? ''] ?? 'Fase Mediasi Tripartit',
                    'sla_remaining_hours' => $slaHoursRemaining,
                    'evidence_deadline' => $evidenceDeadline?->toISOString(),
                    'requires_action' => in_array($dispute['phase'] ?? '', ['fase_1_negosiasi', 'fase_2_bukti']),
                ];
            });

        return Inertia::render('Student/Dashboard', [
            'notifications' => $notifications,
            'activeDisputes' => $activeDisputes,
            'user' => [
                'id' => (string) $user->_id,
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
        $user->forceFill([
            'has_completed_onboarding' => true,
        ])->save();

        $completed = (bool) $request->input('completed', false);
        if ($completed) {
            $progress = UserStat::firstOrCreate([
                'user_id' => (string) $user->_id,
                'course_id' => 'onboarding_rewards',
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

            if (! isset($pathStats['onboarding'])) {
                $pathStats['onboarding'] = [
                    'exp' => 60,
                    'gold' => 60,
                    'quiz_score' => 35,
                ];

                $progress->path_stats = $pathStats;
                $progress->exp = (int) ($progress->exp ?? 0) + 60;
                $progress->gold = (int) ($progress->gold ?? 0) + 60;
                $progress->erp = (int) ($progress->erp ?? 0) + 35;
                $progress->save();
            }
        }

        return redirect()->back();
    }
}
