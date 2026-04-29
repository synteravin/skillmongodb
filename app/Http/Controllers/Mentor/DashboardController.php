<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\MentorCareerGroup;
use App\Models\CourseStudent;

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

        return Inertia::render('Mentor/Dashboard', [
            'mentor' => [
                'name' => $mentor->name,

                'stats' => [
                    'career_groups' => $groups->count(),
                    'students' => $totalStudents,   // ✅ FIX
                    'active' => $activeStudents,    // ✅ FIX
                    'progress' => 0,
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
        ]);
    }
}
