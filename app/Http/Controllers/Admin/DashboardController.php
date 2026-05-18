<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\StudentSubmission;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'leaderboard' => $this->getLeaderboard(),
            'latestUsers' => $this->getLatestUsers(),
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
    private function getLeaderboard(): array
    {
        return UserStat::with('user')
            ->get()
            ->filter(fn ($stat) => $stat->user)
            ->map(function (UserStat $stat) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('s3');

                return [
                    '_id' => (string) $stat->user->_id,
                    'name' => $stat->user->name,
                    'username' => $stat->user->username,
                    'avatar_url' => $stat->user->avatar ? $disk->url($stat->user->avatar) : null,
                    'level' => $stat->current_level,
                    'exp' => $stat->total_exp,
                    'rank' => $stat->rank,
                ];
            })
            ->sortByDesc('total_exp')
            ->take(5)
            ->values()
            ->toArray();
    }

    /**
     * @return array<int, mixed>
     */
    private function getLatestUsers(): array
    {
        return User::latest()
            ->take(5)
            ->get()
            ->map(function (User $u) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('s3');

                return [
                    '_id' => (string) $u->_id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'avatar_url' => $u->avatar ? $disk->url($u->avatar) : null,
                    'created_at' => $u->created_at->diffForHumans(),
                ];
            })
            ->toArray();
    }
}
