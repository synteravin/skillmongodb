<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\UserStat;
use App\Models\LevelBadge;
use App\Models\User;
use Inertia\Inertia;

class CourseRoadmapController extends Controller
{
    public function __invoke(Course $course)
    {
        $user = auth()->user();

        // 🔥 progress user
        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $course->_id
        ], [
            'completed_modules' => [],
            'completed_paths' => [],
            'stage' => 'fundamental',
            'selected_path_id' => null
        ]);

        $course->load([
            'paths.modules.badge',
            'careerGroups.paths.modules.badge',
            'careerGroups.mentor'
        ]);

        $basicPaths = $course->paths
            ->where('phase', 'basic_fundamental')
            ->values()
            ->map(function ($path) {
                return [
                    '_id' => (string) $path->_id,
                    'name' => $path->name,
                    'thumbnail' => $path->thumbnail,
                    'modules' => $path->modules->map(function ($module) {
                        return [
                            '_id' => (string) $module->_id,
                            'title' => $module->title,
                            'badge' => $module->badge ? [
                                'icon' => $module->badge->icon,
                            ] : null,
                        ];
                    }),
                ];
            });

        $careerGroups = $course->careerGroups
            ->values()
            ->map(function ($group) {
                return [
                    '_id' => (string) $group->_id,
                    'name' => $group->name,

                    'mentor' => $group->mentor ? [
                        '_id' => (string) $group->mentor->_id,
                        'name' => $group->mentor->name,
                        'avatar' => $group->mentor->avatar,
                    ] : null,

                    'paths' => $group->paths->map(function ($path) {
                        return [
                            '_id' => (string) $path->_id,
                            'name' => $path->name,
                            'thumbnail' => $path->thumbnail,
                            'modules' => $path->modules->map(function ($module) {
                                return [
                                    '_id' => (string) $module->_id,
                                    'title' => $module->title,
                                    'badge' => $module->badge ? [
                                        'icon' => $module->badge->icon,
                                    ] : null,
                                ];
                            }),

                        ];
                    })
                ];
            });

        return Inertia::render('Student/Roadmap', [
            'course' => [
                '_id' => (string) $course->_id,
                'title' => $course->title,
                'slug' => $course->slug,
                'basic_paths' => $basicPaths,
                'career_groups' => $careerGroups,
            ],
            'badges' => LevelBadge::orderBy('order')->get()->map(function ($b) {
                return [
                    'order' => (int) $b->order,
                    'icon' => $b->icon,
                ];
            }),
            'mentors' => User::where('role', 'mentor')->get()->map(fn($m) => [
                '_id' => (string) $m->_id,
                'name' => $m->name,
            ]),
            'progress' => $progress
        ]);
    }
}