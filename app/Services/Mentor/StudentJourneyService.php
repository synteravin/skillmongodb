<?php

namespace App\Services\Mentor;

use App\Models\CareerGroup;
use App\Models\CourseStudent;
use App\Models\Module;
use App\Models\Path;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\StudentSubmission;
use App\Models\Submission;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class StudentJourneyService
{
    private function s3Url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $disk->url($path);
    }

    public function getDashboardData(User $mentor): array
    {
        $careerGroupIds = CareerGroup::where('mentor_id', (string) $mentor->_id)
            ->get()
            ->pluck('_id')
            ->map(fn ($id) => (string) $id)
            ->toArray();

        $courseStudents = CourseStudent::whereIn('career_group_id', $careerGroupIds)->get();
        $uniqueStudentIds = $courseStudents->pluck('user_id')->unique()->values()->toArray();

        $userStats = UserStat::whereIn('user_id', $uniqueStudentIds)->get()->groupBy('user_id');

        $submissions = StudentSubmission::whereIn('student_id', $uniqueStudentIds)
            ->where('status', 'graded')
            ->get()
            ->groupBy('student_id');

        $students = $courseStudents->groupBy('user_id')->map(function ($enrollments) use ($userStats, $submissions) {
            $studentId = $enrollments->first()->user_id;
            $user = User::find($studentId);
            if (! $user) {
                return null;
            }

            $stats = $userStats->get($studentId, collect());
            $progress = $this->calculateProgress($enrollments, $stats);

            $studentSubmissions = $submissions->get($studentId, collect());
            $avgScore = $studentSubmissions->count() > 0 ? $studentSubmissions->pluck('grade')->avg() : 0;

            $lastActivity = collect([
                optional($studentSubmissions->max('created_at'))->toDateTimeString(),
                optional($user->updated_at)->toDateTimeString(),
            ])->filter()->max();

            return [
                'id' => (string) $user->_id,
                'name' => $user->name,
                'avatar' => $this->s3Url($user->avatar),
                'progressPercent' => $progress['progressPercent'],
                'averageScore' => round($avgScore, 1),
                'status' => $enrollments->first()->status,
                'lastActivity' => $lastActivity,
            ];
        })->filter()->values()->all();

        return [
            'mentor' => [
                'id' => (string) $mentor->_id,
                'name' => $mentor->name,
                'avatar' => $this->s3Url($mentor->avatar),
            ],
            'statistics' => [
                'totalStudents' => count($uniqueStudentIds),
                'activeStudents' => $courseStudents->where('status', 'active')->pluck('user_id')->unique()->count(),
                'completedStudents' => $courseStudents->where('status', 'completed')->pluck('user_id')->unique()->count(),
            ],
            'students' => $students,
        ];
    }

    public function getStudentDetailData(User $mentor, User $student): array
    {
        $enrollments = CourseStudent::where('user_id', (string) $student->_id)->get();
        abort_if($enrollments->isEmpty() && ! $mentor->isAdmin(), 403);

        $stats = UserStat::where('user_id', (string) $student->_id)->get();

        $submissions = StudentSubmission::where('student_id', (string) $student->_id)
            ->where('status', 'graded')
            ->get()
            ->sortByDesc('created_at')
            ->values();

        $careerGroups = $this->getStudentCareerGroups($enrollments, $submissions);
        $progress = $this->calculateProgress($enrollments, $stats);

        $avgScore = $submissions->count() > 0 ? $submissions->pluck('grade')->avg() : 0;
        $highestScore = $submissions->count() > 0 ? $submissions->pluck('grade')->max() : 0;
        $lowestScore = $submissions->count() > 0 ? $submissions->pluck('grade')->min() : 0;

        $lastActivity = collect([
            optional($submissions->max('created_at'))->toDateTimeString(),
            optional($student->updated_at)->toDateTimeString(),
        ])->filter()->max();

        $completedModulesList = $this->getCompletedModulesList($stats);
        $quizResults = $this->getQuizResults((string) $student->_id);
        $expData = $this->calculateStudentExp((string) $student->_id);

        $mappedSubmissions = $submissions->map(function ($studentSubmission) {
            $submission = Submission::find($studentSubmission->submission_id);
            $careerGroup = $submission?->group_id ? CareerGroup::find($submission->group_id) : null;

            return [
                'id' => (string) $studentSubmission->_id,
                'title' => $submission?->title ?? 'Submission',
                'careerPath' => $careerGroup?->name,
                'grade' => $studentSubmission->grade ?? 0,
                'status' => $studentSubmission->status,
                'createdAt' => optional($studentSubmission->created_at)->toDateTimeString(),
            ];
        })->all();

        return [
            'mentor' => [
                'id' => (string) $mentor->_id,
                'name' => $mentor->name,
                'avatar' => $this->s3Url($mentor->avatar),
            ],
            'student' => [
                'id' => (string) $student->_id,
                'name' => $student->name,
                'avatar' => $this->s3Url($student->avatar),
                'level' => $expData['currentLevel'],
                'currentExp' => $expData['currentExp'],
                'totalExp' => $expData['totalExp'],
                'expMax' => $expData['expMax'],
                'progressPercent' => $progress['progressPercent'],
                'completedModules' => $progress['completedModules'],
                'totalModules' => $progress['totalModules'],
                'averageScore' => round($avgScore, 1),
                'highestScore' => $highestScore,
                'lowestScore' => $lowestScore,
                'totalSubmissions' => $submissions->count(),
                'status' => $enrollments->first()->status ?? 'active',
                'lastActivity' => $lastActivity,
                'careerGroups' => $careerGroups,
                'completedModulesList' => $completedModulesList,
                'quizResults' => $quizResults,
                'character' => $student->character ? [
                    'name' => $student->character->name,
                    'avatar' => $this->s3Url($student->character->avatar),
                ] : null,
            ],
            'submissions' => $mappedSubmissions,
        ];
    }

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

    public function getCompletedModulesList(Collection $stats): array
    {
        $completedModuleIds = [];
        foreach ($stats as $stat) {
            $modules = is_string($stat->completed_modules)
                ? json_decode($stat->completed_modules, true)
                : ($stat->completed_modules ?? []);
            if (is_array($modules)) {
                $completedModuleIds = array_merge($completedModuleIds, $modules);
            }
        }
        $completedModuleIds = array_unique($completedModuleIds);

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

    public function calculateProgress(Collection $enrollments, Collection $stats): array
    {
        $completedModuleIds = [];
        foreach ($stats as $stat) {
            $modules = is_string($stat->completed_modules)
                ? json_decode($stat->completed_modules, true)
                : ($stat->completed_modules ?? []);
            if (is_array($modules)) {
                $completedModuleIds = array_merge($completedModuleIds, $modules);
            }
        }
        $completedModules = collect(array_unique($completedModuleIds));

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
