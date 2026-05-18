<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Rank;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user()->load(['userStats', 'courseStudents']);

        $totalExp = 0;
        $totalGold = 0;

        $totalScore = 0;
        $totalQuiz = 0;

        $completedModules = [];
        $completedPaths = [];
        $selectedPathId = null;

        // ========================
        // 🔥 LOOP USER STATS
        // ========================
        foreach ($user->userStats as $stat) {

            // ✅ PROGRESS
            $completedModules = is_string($stat->completed_modules)
                ? json_decode($stat->completed_modules, true)
                : ($stat->completed_modules ?? []);

            $completedPaths = is_string($stat->completed_paths)
                ? json_decode($stat->completed_paths, true)
                : ($stat->completed_paths ?? []);

            $selectedPathId = $stat->selected_path_id;

            if (! $stat->path_stats) {
                continue;
            }

            // ✅ NORMALIZE MONGO
            $pathStats = $stat->path_stats;

            if (is_string($pathStats)) {
                $pathStats = json_decode($pathStats, true);
            } elseif (is_object($pathStats)) {
                $pathStats = json_decode(json_encode($pathStats), true);
            }

            foreach ($pathStats as $value) {
                $item = (array) $value;

                $totalExp += $item['exp'] ?? 0;
                $totalGold += $item['gold'] ?? 0;

                if (isset($item['quiz_score'])) {
                    $totalScore += $item['quiz_score'];
                    $totalQuiz++;
                }
            }
        }

        // ========================
        // 🔥 CALCULATE STATS
        // ========================
        $avgScore = $totalQuiz > 0
            ? round($totalScore / $totalQuiz)
            : 0;

        $expPerLevel = 500;

        $currentLevel = floor($totalExp / $expPerLevel) + 1;

        $currentLevelMinExp = ($currentLevel - 1) * $expPerLevel;
        $currentLevelMaxExp = $currentLevel * $expPerLevel;

        // ========================
        // 🔥 LAST MODULE (REAL PROGRESS)
        // ========================
        $lastModuleId = ! empty($completedModules)
            ? end($completedModules)
            : null;

        $lastModule = $lastModuleId
            ? Module::with('path.course')->find($lastModuleId)
            : null;

        // ========================
        // 🔥 LAST COURSE DATA (REAL)
        // ========================
        $lastCourseData = null;

        if ($lastModule) {
            $lastCourseData = [
                'course_name' => $lastModule->path->course->title ?? 'Unknown Course',
                'path_name' => $lastModule->path->name ?? 'Unknown Path',
                'module_name' => $lastModule->title ?? 'Unknown Module',

                'level' => 'Level '.$currentLevel,

                'url' => route('student.course.path.module.show', [
                    $lastModule->path->course->_id,
                    $lastModule->path->_id,
                    $lastModule->_id,
                ]),
            ];
        }
        // ambil rank
        $ranks = Rank::orderBy('order')->get();

        // pakai QUIZ SCORE (bukan exp)
        $step = floor($totalScore / 500);

        $tierIndex = floor($step / 3);
        $star = ($step % 3) + 1;

        $tier = $ranks[$tierIndex] ?? $ranks->last();

        $rankData = [
            'name' => $tier->name,
            'image' => $tier->image_url,
            'star' => $star,
        ];
        // ========================
        // 🔥 RESPONSE
        // ========================
        // return Inertia::render('Student/Profile', [
        //     'user' => [
        //         'name' => $user->name,

        //         'level' => $currentLevel,
        //         'exp' => $totalExp,
        //         'exp_min' => $currentLevelMinExp,
        //         'exp_max' => $currentLevelMaxExp,
        //         'gold' => $totalGold,
        //         'avg_score' => $avgScore,
        //         'courses' => $user->courseStudents->count(),

        //         'avatar' => $user->avatar
        //             ? asset('storage/' . $user->avatar)
        //             : null,

        //         // ✅ REAL LAST PROGRESS
        //         'last_course' => $lastCourseData,

        //         // 🔥 ROADMAP ENGINE
        //         'progress' => [
        //             'completed_modules' => $completedModules ?? [],
        //             'completed_paths' => $completedPaths ?? [],
        //             'selected_path_id' => $selectedPathId,
        //         ],
        //     ]
        // ]);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = \Illuminate\Support\Facades\Storage::disk('s3');

        $userAvatar = null;
        if ($user->avatar) {
            $userAvatar = str_starts_with($user->avatar, 'http') ? $user->avatar : $disk->url($user->avatar);
        }

        // 🔥 RESPONSE
        return Inertia::render('Student/Profile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email, // Added email

                'level' => $currentLevel,
                'exp' => $totalExp,
                'exp_min' => $currentLevelMinExp,
                'exp_max' => $currentLevelMaxExp,
                'gold' => $totalGold,
                'avg_score' => $avgScore,
                'courses' => $user->courseStudents->count(),

                'avatar' => $userAvatar,

                'rank' => $rankData,

                // 🔥 TAMBAHKAN INI (untuk progress star)
                'total_score' => $totalScore,

                'last_course' => $lastCourseData,

                'progress' => [
                    'completed_modules' => $completedModules ?? [],
                    'completed_paths' => $completedPaths ?? [],
                    'selected_path_id' => $selectedPathId,
                ],
            ],
        ]);
    }

    public function update(\Illuminate\Http\Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 's3');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
