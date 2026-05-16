<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\CourseStudent;
use App\Models\StudentSubmission;
use App\Models\Submission;
use App\Models\User;
use App\Models\UserStat;
use App\Services\Mentor\StudentJourneyService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function __construct(private StudentJourneyService $studentJourneyService)
    {
    }

    private function s3Url(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $disk->url($path);
    }

    private function getCareerGroupIds(User $mentor): array
    {
        return CareerGroup::where('mentor_id', (string) $mentor->_id)
            ->get()
            ->map(fn($careerGroup) => (string) $careerGroup->_id)
            ->toArray();
    }

    private function getCareerGroups(Collection $enrollments): array
    {
        return $enrollments
            ->map(function ($enrollment) {
                $careerGroup = CareerGroup::find($enrollment->career_group_id);

                if (!$careerGroup) {
                    return null;
                }

                return [
                    'id' => (string) $careerGroup->_id,
                    'name' => $careerGroup->name,
                ];
            })
            ->filter()
            ->unique('id')
            ->values()
            ->all();
    }

    public function index(Request $request)
    {
        $mentor = $request->user();

        abort_if(!$mentor->isMentor() && !$mentor->isAdmin(), 403);

        $careerGroupIds = $this->getCareerGroupIds($mentor);

        $courseStudents = CourseStudent::whereIn('career_group_id', $careerGroupIds)
            ->get();

        $uniqueStudentIds = $courseStudents
            ->pluck('user_id')
            ->unique()
            ->values()
            ->toArray();

        $userStats = UserStat::whereIn('user_id', $uniqueStudentIds)
            ->get()
            ->keyBy('user_id');

        $submissions = StudentSubmission::whereIn('student_id', $uniqueStudentIds)
            ->where('status', 'graded')
            ->get()
            ->groupBy('student_id');

        $students = $courseStudents
            ->groupBy('user_id')
            ->map(function ($enrollments) use ($userStats, $submissions) {
                $studentId = $enrollments->first()->user_id;

                $user = User::find($studentId);

                if (!$user) {
                    return null;
                }

                $stat = $userStats->get($studentId);
                $progress = $this->studentJourneyService->calculateProgress($enrollments, $stat);

                $studentSubmissions = $submissions->get($studentId, collect());

                $avgScore = $studentSubmissions->count() > 0
                    ? $studentSubmissions->pluck('grade')->sum() / $studentSubmissions->count()
                    : 0;

                $lastActivity = collect([
                    optional($studentSubmissions->max('created_at'))->toDateTimeString(),
                    optional($user->updated_at)->toDateTimeString(),
                ])
                    ->filter()
                    ->max();

                return [
                    'id' => (string) $user->_id,
                    'name' => $user->name,
                    'avatar' => $this->s3Url($user->avatar),
                    'progressPercent' => $progress['progressPercent'],
                    'averageScore' => round($avgScore, 1),
                    'status' => $enrollments->first()->status,
                    'lastActivity' => $lastActivity,
                ];
            })
            ->filter()
            ->values()
            ->all();

        $activeStudents = $courseStudents
            ->where('status', 'active')
            ->pluck('user_id')
            ->unique()
            ->count();

        $completedStudents = $courseStudents
            ->where('status', 'completed')
            ->pluck('user_id')
            ->unique()
            ->count();

        return Inertia::render('Mentor/StudentJourney/Index', [
            'mentor' => [
                'id' => (string) $mentor->_id,
                'name' => $mentor->name,
                'avatar' => $this->s3Url($mentor->avatar),
            ],
            'statistics' => [
                'totalStudents' => count($uniqueStudentIds),
                'activeStudents' => $activeStudents,
                'completedStudents' => $completedStudents,
            ],
            'students' => $students,
        ]);
    }

    public function show(Request $request, string $student)
    {
        $mentor = $request->user();

        abort_if(!$mentor->isMentor() && !$mentor->isAdmin(), 403);

        $student = User::findOrFail($student);

        $enrollments = CourseStudent::where('user_id', (string) $student->_id)
            ->get();
        // dd([
        //     'student_id' => (string) $student->_id,
        //     'enrollments_count' => $enrollments->count(),
        //     'career_group_ids' => $enrollments->pluck('career_group_id')->toArray(),
        //     'unique_career_group_ids' => $enrollments->pluck('career_group_id')->unique()->values()->toArray(),
        //     'career_groups_found' => $this->getCareerGroups($enrollments),
        // ]);
        abort_if($enrollments->isEmpty(), 404);

        abort_if($enrollments->isEmpty() && !$mentor->isAdmin(), 403);

        $stat = UserStat::where('user_id', (string) $student->_id)->first();

        $submissions = StudentSubmission::where('student_id', (string) $student->_id)
            ->where('status', 'graded')
            ->get()
            ->sortByDesc('created_at')
            ->values();

        $careerGroups = $this->studentJourneyService->getStudentCareerGroups($enrollments, $submissions);
        $progress = $this->studentJourneyService->calculateProgress($enrollments, $stat);

        $avgScore = $submissions->count() > 0 ? $submissions->pluck('grade')->avg() : 0;
        $highestScore = $submissions->count() > 0 ? $submissions->pluck('grade')->max() : 0;
        $lowestScore = $submissions->count() > 0 ? $submissions->pluck('grade')->min() : 0;

        $lastActivity = collect([
            optional($submissions->max('created_at'))->toDateTimeString(),
            optional($student->updated_at)->toDateTimeString(),
        ])->filter()->max();

        $completedModulesList = $this->studentJourneyService->getCompletedModulesList($stat);
        $quizResults = $this->studentJourneyService->getQuizResults((string) $student->_id);
        $expData = $this->studentJourneyService->calculateStudentExp((string) $student->_id);

        return Inertia::render('Mentor/StudentJourney/Show', [
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
            'submissions' => $submissions->map(function ($studentSubmission) {

                $submission = Submission::find(
                    $studentSubmission->submission_id
                );

                $careerGroup = null;

                if ($submission?->group_id) {
                    $careerGroup = CareerGroup::find(
                        $submission->group_id
                    );
                }

                return [
                    'id' => (string) $studentSubmission->_id,

                    'title' => $submission?->title ?? 'Submission',

                    'careerPath' => $careerGroup?->name,

                    'grade' => $studentSubmission->grade ?? 0,

                    'status' => $studentSubmission->status,

                    'createdAt' => optional(
                        $studentSubmission->created_at
                    )->toDateTimeString(),
                ];
            })->all(),
        ]);
    }
}
