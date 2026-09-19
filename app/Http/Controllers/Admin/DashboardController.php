<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\ForumMessage;
use App\Models\Path;
use App\Models\Quest;
use App\Models\QuestFlag;
use App\Models\StudentSubmission;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with overview metrics.
     */
    public function index(Request $request): Response
    {
        $days = (int) $request->input('period', 30);
        if (! in_array($days, [7, 30, 90])) {
            $days = 30;
        }

        // 1. Action Required Center (Urgent Operational Queues)
        $pendingSubmissions = StudentSubmission::where('status', 'submitted')->count();
        $questFlags = QuestFlag::where('status', 'pending')->count();
        $pendingQuests = Quest::where('status', 'submitted')->count();
        $draftCourses = Course::where('is_active', false)->count();

        $actionRequired = [
            'pending_submissions' => $pendingSubmissions,
            'quest_flags' => $questFlags,
            'pending_quests' => $pendingQuests,
            'draft_courses' => $draftCourses,
            'total_alerts' => $pendingSubmissions + $questFlags + $pendingQuests,
        ];

        $totalStudents = User::where('role', 'student')->count();
        $totalMentors = User::where('role', 'mentor')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $activeStudents = CourseStudent::with('user')
            ->where('status', 'active')
            ->get()
            ->filter(fn ($cs) => $cs->user && $cs->user->role === 'student')
            ->pluck('user_id')
            ->unique()
            ->count();

        $totalCourses = Course::count();
        $publishedCourses = Course::where('is_active', true)->count();
        $totalEnrollments = CourseStudent::count();

        $totalSubmissions = StudentSubmission::count();
        $gradedSubmissions = StudentSubmission::where('status', 'graded')->count();
        $certificatesIssued = StudentSubmission::whereNotNull('certificate_path')->count();

        $totalQuests = Quest::count();
        $activeQuests = Quest::whereIn('status', ['open', 'ongoing'])->count();
        $completedQuests = Quest::where('status', 'completed')->count();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'users' => [
                    'student' => $totalStudents,
                    'mentor' => $totalMentors,
                    'admin' => $totalAdmins,
                    'total' => $totalStudents + $totalMentors + $totalAdmins,
                    'active_students' => $activeStudents,
                ],
                'courses' => [
                    'total' => $totalCourses,
                    'published' => $publishedCourses,
                    'total_enrollments' => $totalEnrollments,
                ],
                'submissions' => [
                    'total' => $totalSubmissions,
                    'pending' => $pendingSubmissions,
                    'graded' => $gradedSubmissions,
                    'approved' => $gradedSubmissions, // backwards-compatibility
                ],
                'certificates' => [
                    'issued' => $certificatesIssued,
                ],
                'quests' => [
                    'total' => $totalQuests,
                    'active' => $activeQuests,
                    'completed' => $completedQuests,
                    'pending_approval' => $pendingQuests,
                ],
            ],
            'actionRequired' => $actionRequired,
            'popularCourses' => $this->getPopularCourses(),
            'activityTrends' => $this->getActivityTrends($days),
            'careerBranchDistribution' => $this->getCareerBranchDistribution(),
            'gamificationStats' => $this->getGamificationStats(),
            'topStudents' => $this->getTopStudents(),
            'recentActivities' => $this->getRecentActivities(),
            'selectedPeriod' => $days,
        ]);
    }

    /**
     * Get most popular courses based on enrollments count without N+1 queries.
     *
     * @return array<int, mixed>
     */
    private function getPopularCourses(): array
    {
        $enrollmentCounts = CourseStudent::all()->groupBy('course_id')->map->count();

        return Course::where('is_active', true)
            ->get()
            ->map(function (Course $course) use ($enrollmentCounts) {
                return [
                    '_id' => (string) $course->_id,
                    'title' => $course->title,
                    'thumbnail_url' => $course->thumbnail_url,
                    'students_count' => $enrollmentCounts->get((string) $course->_id, 0),
                ];
            })
            ->sortByDesc('students_count')
            ->take(5)
            ->values()
            ->toArray();
    }

    /**
     * Get real activity trends (enrollments vs submissions) over the selected days.
     *
     * @return array<int, mixed>
     */
    private function getActivityTrends(int $days = 30): array
    {
        $startDate = now()->subDays($days)->startOfDay();

        $enrollments = CourseStudent::where('created_at', '>=', $startDate)
            ->get()
            ->groupBy(function ($cs) {
                return $cs->created_at ? $cs->created_at->format('Y-m-d') : '';
            })
            ->map->count();

        $submissionsCount = StudentSubmission::where('created_at', '>=', $startDate)
            ->get()
            ->groupBy(function ($submission) {
                return $submission->created_at ? $submission->created_at->format('Y-m-d') : '';
            })
            ->map->count();

        $activityTrends = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $dateObj = now()->subDays($i);
            $dateStr = $dateObj->format('Y-m-d');
            $label = $dateObj->format('d M');
            $activityTrends[] = [
                'date' => $dateStr,
                'label' => $label,
                'enrollments' => $enrollments->get($dateStr, 0),
                'submissions' => $submissionsCount->get($dateStr, 0),
                'users' => $enrollments->get($dateStr, 0), // backwards-compatibility
            ];
        }

        return $activityTrends;
    }

    /**
     * Get student distribution across career branches in O(1) in-memory lookups.
     *
     * @return array<int, mixed>
     */
    private function getCareerBranchDistribution(): array
    {
        $careerGroups = CareerGroup::all()->keyBy(fn ($g) => (string) $g->_id);
        $paths = Path::whereNotNull('career_group_id')->pluck('career_group_id', '_id')->toArray();
        $userStats = UserStat::all();
        $grouped = [];
        $totalStudents = 0;

        foreach ($userStats as $stat) {
            $counted = false;

            // 1. Check active path
            if ($stat->selected_path_id && isset($paths[$stat->selected_path_id])) {
                $groupId = (string) $paths[$stat->selected_path_id];
                $grouped[$groupId] = ($grouped[$groupId] ?? 0) + 1;
                $counted = true;
            }

            // 2. Check completed groups
            if (is_array($stat->completed_career_groups)) {
                foreach ($stat->completed_career_groups as $groupId) {
                    $groupId = (string) $groupId;
                    // Avoid double counting if active on the same group
                    if ($stat->selected_path_id && isset($paths[$stat->selected_path_id]) && (string) $paths[$stat->selected_path_id] === $groupId) {
                        continue;
                    }
                    $grouped[$groupId] = ($grouped[$groupId] ?? 0) + 1;
                    $counted = true;
                }
            }

            if ($counted) {
                $totalStudents++;
            }
        }

        $distribution = [];
        $validTotal = 0;

        foreach ($grouped as $groupId => $count) {
            $careerGroup = $careerGroups->get($groupId);
            if (! $careerGroup) {
                continue;
            }
            $validTotal += $count;
        }

        if ($validTotal === 0) {
            return [];
        }

        foreach ($grouped as $groupId => $count) {
            $careerGroup = $careerGroups->get($groupId);
            if (! $careerGroup) {
                continue;
            }
            $distribution[] = [
                'id' => $groupId,
                'name' => $careerGroup->name,
                'count' => $count,
                'percentage' => round(($count / $validTotal) * 100, 1),
            ];
        }

        usort($distribution, function ($a, $b) {
            return $b['count'] <=> $a['count'];
        });

        return $distribution;
    }

    /**
     * Get gamification economy aggregates.
     *
     * @return array{total_exp: int, total_gold: int, average_level: float}
     */
    private function getGamificationStats(): array
    {
        $userStats = UserStat::all();
        $totalExp = 0;
        $totalGold = 0;
        $totalLevels = 0;
        $count = $userStats->count();

        foreach ($userStats as $stat) {
            $totalExp += $stat->total_exp;
            $totalLevels += $stat->current_level;

            $gold = 0;
            if (is_array($stat->path_stats)) {
                foreach ($stat->path_stats as $pathStat) {
                    $gold += $pathStat['gold'] ?? 0;
                }
            }
            $totalGold += max((int) ($stat->gold ?? 0), $gold);
        }

        return [
            'total_exp' => $totalExp,
            'total_gold' => $totalGold,
            'average_level' => $count > 0 ? round($totalLevels / $count, 1) : 1.0,
        ];
    }

    /**
     * Get top 5 students by total EXP for RPG Leaderboard snapshot.
     *
     * @return array<int, mixed>
     */
    private function getTopStudents(): array
    {
        return User::where('role', 'student')
            ->with('userStats')
            ->get()
            ->map(function ($student) {
                $totalExp = 0;
                $totalGold = 0;
                foreach ($student->userStats as $stat) {
                    $totalExp += $stat->total_exp;
                    $totalGold += (int) ($stat->gold ?? 0);
                }
                $level = (int) (floor($totalExp / 500) + 1);

                return [
                    '_id' => (string) $student->_id,
                    'name' => $student->name,
                    'username' => $student->username,
                    'avatar' => $student->avatar,
                    'total_exp' => $totalExp,
                    'total_gold' => $totalGold,
                    'level' => $level,
                ];
            })
            ->sortByDesc('total_exp')
            ->take(5)
            ->values()
            ->toArray();
    }

    /**
     * Get recent platform activities across enrollments, submissions, and community.
     *
     * @return array<int, mixed>
     */
    private function getRecentActivities(): array
    {
        $enrollmentActs = CourseStudent::with(['user', 'course'])
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($cs) {
                return [
                    'id' => (string) $cs->_id,
                    'type' => 'enrollment',
                    'title' => ($cs->user?->name ?? 'Siswa').' mendaftar di '.($cs->course?->title ?? 'Kursus'),
                    'time' => $cs->created_at ? $cs->created_at->diffForHumans() : 'Baru saja',
                    'timestamp' => $cs->created_at ? $cs->created_at->timestamp : 0,
                ];
            });

        $submissionActs = StudentSubmission::with(['student'])
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($sub) {
                $actionText = $sub->status === 'graded' ? 'menyelesaikan penilaian tugas' : 'mengumpulkan tugas';

                return [
                    'id' => (string) $sub->_id,
                    'type' => 'submission',
                    'title' => ($sub->student?->name ?? 'Siswa').' '.$actionText,
                    'time' => $sub->created_at ? $sub->created_at->diffForHumans() : 'Baru saja',
                    'timestamp' => $sub->created_at ? $sub->created_at->timestamp : 0,
                ];
            });

        $forumActs = ForumMessage::with(['sender', 'course'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($f) {
                $authorName = $f->sender?->name ?? $f->user?->name ?? 'Pengguna';

                return [
                    'id' => (string) $f->_id,
                    'type' => 'forum',
                    'title' => $authorName.' mengirim pesan di forum '.($f->course?->title ?? 'Diskusi'),
                    'time' => $f->created_at ? $f->created_at->diffForHumans() : 'Baru saja',
                    'timestamp' => $f->created_at ? $f->created_at->timestamp : 0,
                ];
            });

        return $enrollmentActs
            ->concat($submissionActs)
            ->concat($forumActs)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values()
            ->toArray();
    }
}
