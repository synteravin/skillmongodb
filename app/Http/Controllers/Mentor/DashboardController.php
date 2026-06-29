<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\CourseStudent;
use App\Models\MentorCareerGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $mentor = $request->user();

        $groups = MentorCareerGroup::with('careerGroup')
            ->where('mentor_id', (string) $mentor->_id)
            ->get()
            ->pluck('careerGroup');

        // 🔥 HITUNG TOTAL STUDENT
        $totalStudents = $groups->sum(function ($group) {
            return CourseStudent::where(
                'career_group_id',
                (string) $group->_id
            )->count();
        });

        // 🔥 HITUNG ACTIVE STUDENT
        $activeStudents = $groups->sum(function ($group) {
            return CourseStudent::where(
                'career_group_id',
                (string) $group->_id
            )
                ->where('status', 'active')
                ->count();
        });

        $unreadNotifications = $mentor->unreadNotifications()->take(15)->get();

        return Inertia::render('Mentor/Dashboard', [
            'mentor' => [
                'name' => $mentor->name,
                'username' => $mentor->username ?? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $mentor->name)),

                'stats' => [
                    'career_groups' => $groups->count(),
                    'students' => $totalStudents,   // ✅ FIX
                    'active' => $activeStudents,    // ✅ FIX
                    'pending_reviews' => $unreadNotifications->count(),
                ],

                'careerGroups' => $groups->map(function ($group) {
                    $students = CourseStudent::where(
                        'career_group_id',
                        (string) $group->_id
                    )->count();

                    $active = CourseStudent::where(
                        'career_group_id',
                        (string) $group->_id
                    )
                        ->where('status', 'active')
                        ->count();

                    return [
                        'id' => (string) $group->_id,
                        'name' => $group->name,
                        'paths_count' => $group->paths()->count(),
                        'students' => $students,   // ✅ TAMBAH
                        'active' => $active,       // ✅ TAMBAH
                    ];
                })->values()->all(),
            ],
            'notifications' => $unreadNotifications->map(function ($notif) {
                return [
                    'id' => $notif->id,
                    'data' => $notif->data,
                    'created_at' => $notif->created_at->diffForHumans(),
                ];
            }),
        ]);
    }
}
