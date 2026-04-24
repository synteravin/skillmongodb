<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Module;

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

            if (!$stat->path_stats)
                continue;

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
        $lastModuleId = !empty($completedModules)
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

                'level' => 'Level ' . $currentLevel,

                'url' => route('student.course.path.module.show', [
                    $lastModule->path->course->_id,
                    $lastModule->path->_id,
                    $lastModule->_id,
                ]),
            ];
        }

        // ========================
        // 🔥 RESPONSE
        // ========================
        return Inertia::render('Student/Profile', [
            'user' => [
                'name' => $user->name,

                'level' => $currentLevel,
                'exp' => $totalExp,
                'exp_min' => $currentLevelMinExp,
                'exp_max' => $currentLevelMaxExp,
                'gold' => $totalGold,
                'avg_score' => $avgScore,
                'courses' => $user->courseStudents->count(),

                'avatar' => $user->avatar
                    ? asset('storage/' . $user->avatar)
                    : null,

                // ✅ REAL LAST PROGRESS
                'last_course' => $lastCourseData,

                // 🔥 ROADMAP ENGINE
                'progress' => [
                    'completed_modules' => $completedModules ?? [],
                    'completed_paths' => $completedPaths ?? [],
                    'selected_path_id' => $selectedPathId,
                ],
            ]
        ]);
    }
}