<?php

namespace App\Services\Mentor;

use App\Models\CareerGroup;
use App\Models\Module;
use App\Models\Path;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\Submission;
use App\Models\UserStat;
use Illuminate\Support\Collection;

class StudentJourneyService
{
    public function getStudentCareerGroups(Collection $enrollments, Collection $submissions): array
    {
        $submissionIds = $submissions->pluck('submission_id')->unique()->values()->toArray();
        $submissionGroupIds = Submission::whereIn('_id', $submissionIds)
            ->get()
            ->pluck('group_id')->unique()->values()->toArray();

        $enrollmentGroupIds = $enrollments->pluck('career_group_id')->unique()->values()->toArray();

        $allCareerGroupIds = collect($enrollmentGroupIds)
            ->merge($submissionGroupIds)
            ->unique()->values()->toArray();

        return CareerGroup::whereIn('_id', $allCareerGroupIds)
            ->get()
            ->map(fn ($group) => ['id' => (string) $group->_id, 'name' => $group->name])
            ->values()->all();
    }

    public function getCompletedModulesList(?UserStat $stat): array
    {
        $completedModuleIds = $stat ? ($stat->completed_modules ?? []) : [];

        return Module::whereIn('_id', $completedModuleIds)
            ->get(['title', 'type'])
            ->map(fn ($m) => ['title' => $m->title, 'type' => $m->type ?? 'Module'])
            ->values()->all();
    }

    public function getQuizResults(string $studentId): array
    {
        return QuizResult::where('user_id', $studentId)
            ->get()
            ->map(function ($q) {
                $quiz = Quiz::find($q->quiz_id);
                $path = $quiz ? Path::find($quiz->path_id) : null;

                return [
                    'id' => (string) $q->_id,
                    'title' => $path ? $path->name.' Quiz' : 'Quiz',
                    'score' => $q->score,
                    'passed' => $q->passed,
                    'completedAt' => $q->completed_at ?? $q->created_at,
                ];
            })
            ->sortByDesc('completedAt')->values()->all();
    }

    public function calculateStudentExp(string $studentId): array
    {
        $userStats = UserStat::where('user_id', $studentId)->get();
        $totalExp = 0;
        foreach ($userStats as $s) {
            if (! $s->path_stats) {
                continue;
            }

            $pathStats = $s->path_stats;
            if (is_string($pathStats)) {
                $pathStats = json_decode($pathStats, true);
            } elseif (is_object($pathStats)) {
                $pathStats = json_decode(json_encode($pathStats), true);
            }

            foreach ($pathStats as $value) {
                $item = (array) $value;
                $totalExp += $item['exp'] ?? 0;
            }
        }

        $expPerLevel = 500;

        return [
            'totalExp' => $totalExp,
            'currentLevel' => (int) (floor($totalExp / $expPerLevel) + 1),
            'currentExp' => $totalExp % $expPerLevel,
            'expMax' => $expPerLevel,
        ];
    }

    public function calculateProgress(Collection $enrollments, ?UserStat $stat): array
    {
        $completedModules = collect($stat->completed_modules ?? []);

        $courseIds = $enrollments
            ->pluck('course_id')
            ->unique()
            ->values()
            ->toArray();

        $pathIds = Path::whereIn('course_id', $courseIds)
            ->get()
            ->map(fn ($path) => (string) $path->_id)
            ->toArray();

        $totalModules = Module::whereIn('path_id', $pathIds)->count();

        $progressPercent = $totalModules > 0
            ? min(($completedModules->count() / $totalModules) * 100, 100)
            : 0;

        return [
            'completedModules' => $completedModules->count(),
            'totalModules' => $totalModules,
            'progressPercent' => (int) round($progressPercent),
        ];
    }
}
