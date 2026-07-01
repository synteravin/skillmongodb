<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\Path;
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
        $user = $request->user();

        // 1. Overview Metrics
        $totalStudents = User::where('role', 'student')->count();
        $totalMentors = User::where('role', 'mentor')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        $totalCourses = Course::count();
        $publishedCourses = Course::where('is_active', true)->count();

        $totalSubmissions = StudentSubmission::count();
        $approvedSubmissions = StudentSubmission::where('status', 'graded')->count();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'users' => [
                    'student' => $totalStudents,
                    'mentor' => $totalMentors,
                    'admin' => $totalAdmins,
                    'total' => $totalStudents + $totalMentors + $totalAdmins,
                ],
                'courses' => [
                    'total' => $totalCourses,
                    'published' => $publishedCourses,
                ],
                'submissions' => [
                    'total' => $totalSubmissions,
                    'approved' => $approvedSubmissions,
                ],
            ],
            'popularCourses' => $this->getPopularCourses(),
            'activityTrends' => $this->getActivityTrends(),
            'careerBranchDistribution' => $this->getCareerBranchDistribution(),
            'gamificationStats' => $this->getGamificationStats(),
        ]);
    }

    /**
     * @return array<int, mixed>
     */
    private function getPopularCourses(): array
    {
        return Course::where('is_active', true)
            ->get()
            ->map(function (Course $course) {
                return [
                    '_id' => (string) $course->_id,
                    'title' => $course->title,
                    'thumbnail_url' => $course->thumbnail_url,
                    'students_count' => $course->courseStudents()->count(),
                ];
            })
            ->sortByDesc('students_count')
            ->take(5)
            ->values()
            ->toArray();
    }

    /**
     * @return array<int, mixed>
     */
    private function getActivityTrends(): array
    {
        $startDate = now()->subDays(30)->startOfDay();

        $studentActivity = UserStat::where('updated_at', '>=', $startDate)
            ->get()
            ->groupBy(function (UserStat $stat) {
                return $stat->updated_at ? $stat->updated_at->format('Y-m-d') : '';
            })
            ->map->count();

        $submissionsCount = StudentSubmission::where('created_at', '>=', $startDate)
            ->get()
            ->groupBy(function (StudentSubmission $submission) {
                return $submission->created_at ? $submission->created_at->format('Y-m-d') : '';
            })
            ->map->count();

        $activityTrends = [];
        for ($i = 29; $i >= 0; $i--) {
            $dateObj = now()->subDays($i);
            $dateStr = $dateObj->format('Y-m-d');
            $label = $dateObj->format('d M');
            $activityTrends[] = [
                'date' => $dateStr,
                'label' => $label,
                'users' => $studentActivity->get($dateStr, 0),
                'submissions' => $submissionsCount->get($dateStr, 0),
            ];
        }

        return $activityTrends;
    }

    /**
     * @return array<int, mixed>
     */
    private function getCareerBranchDistribution(): array
    {
        $userStats = UserStat::all();
        $grouped = [];
        $totalStudents = 0;

        foreach ($userStats as $stat) {
            $counted = false;

            // 1. Check active path
            if ($stat->selected_path_id) {
                $path = Path::find($stat->selected_path_id);
                if ($path && $path->career_group_id) {
                    $groupId = (string) $path->career_group_id;
                    $grouped[$groupId] = ($grouped[$groupId] ?? 0) + 1;
                    $counted = true;
                }
            }

            // 2. Check completed groups
            if (is_array($stat->completed_career_groups)) {
                foreach ($stat->completed_career_groups as $groupId) {
                    $groupId = (string) $groupId;
                    // Avoid double counting if active on the same group
                    if ($stat->selected_path_id) {
                        $path = Path::find($stat->selected_path_id);
                        if ($path && (string) $path->career_group_id === $groupId) {
                            continue;
                        }
                    }
                    $grouped[$groupId] = ($grouped[$groupId] ?? 0) + 1;
                    $counted = true;
                }
            }

            if ($counted) {
                $totalStudents++;
            }
        }

        if ($totalStudents === 0) {
            return [];
        }

        $distribution = [];
        foreach ($grouped as $groupId => $count) {
            $careerGroup = CareerGroup::find($groupId);
            $distribution[] = [
                'id' => $groupId,
                'name' => $careerGroup ? $careerGroup->name : 'Cabang Tidak Dikenal',
                'count' => $count,
                'percentage' => round(($count / $totalStudents) * 100, 1),
            ];
        }

        usort($distribution, function ($a, $b) {
            return $b['count'] <=> $a['count'];
        });

        return $distribution;
    }

    /**
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
}
