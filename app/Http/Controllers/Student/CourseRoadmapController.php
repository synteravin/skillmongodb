<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\LevelBadge;
use App\Models\User;
use App\Models\UserStat;
use Inertia\Inertia;

class CourseRoadmapController extends Controller
{
    public function __invoke(Course $course)
    {
        $this->authorize('access', $course);

        $user = auth()->user();

        /* ================= PROGRESS ================= */

        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $course->_id,
        ], [
            'completed_modules' => [],
            'completed_paths' => [],
            'stage' => 'fundamental',
            'selected_path_id' => null,
        ]);

        $course->load([
            'paths.modules.badge',
            'careerGroups.paths.modules.badge',
            'careerGroups.mentor',
        ]);

        /* ================= BASIC FUNDAMENTAL ================= */

        $basicCollection = $course->paths
            ->where('phase', 'basic_fundamental')
            ->sortBy('order')
            ->values();

        $basicPaths = $basicCollection->map(function ($path, $index) use ($progress, $basicCollection) {

            $pathId = (string) $path->_id;

            $isCompleted = in_array($pathId, $progress->completed_paths);

            if ($index === 0) {
                $isUnlocked = true;
            } else {
                $prev = $basicCollection[$index - 1];
                $isUnlocked = in_array((string) $prev->_id, $progress->completed_paths);
            }

            $modules = $path->modules
                ->sortBy('order')
                ->values();

            $firstModule = $modules->first();

            return [
                '_id' => $pathId,
                'name' => $path->name,
                'thumbnail' => $path->thumbnail,
                'is_unlocked' => $isUnlocked,
                'is_completed' => $isCompleted,

                // 🔥 INI YANG PALING PENTING
                'first_module_id' => $firstModule
                    ? (string) $firstModule->_id
                    : null,

                'modules' => $modules->map(fn ($m) => [
                    '_id' => (string) $m->_id,
                    'title' => $m->title,
                    'badge' => $m->badge ? [
                        'icon' => $m->badge->icon,
                    ] : null,
                ]),
            ];
        });

        /* ================= CHECK BASIC DONE ================= */

        $basicIds = $basicCollection
            ->pluck('_id')
            ->map(fn ($id) => (string) $id)
            ->toArray();

        $isBasicCompleted = count(array_diff($basicIds, $progress->completed_paths)) === 0;

        /* ================= CAREER ================= */

        $careerGroups = $course->careerGroups
            ->values()
            ->map(function ($group) use ($progress, $isBasicCompleted) {

                $groupId = (string) $group->_id;
                $isGroupCompleted = in_array($groupId, $progress->completed_career_groups ?? []);

                return [
                    '_id' => $groupId,
                    'name' => $group->name,
                    'is_completed' => $isGroupCompleted,
                    'mentor' => $group->mentor ? [
                        '_id' => (string) $group->mentor->_id,
                        'name' => $group->mentor->name,
                        'avatar' => $group->mentor->avatar,
                    ] : null,

                    'paths' => $group->paths
                        ->sortBy('order')
                        ->values()
                        ->map(function ($path, $index) use ($progress, $isBasicCompleted) {

                            $pathId = (string) $path->_id;

                            $isSelected = $progress->selected_path_id === $pathId;
                            $isCompleted = in_array($pathId, $progress->completed_paths);
                            $modules = $path->modules
                                ->sortBy('order')
                                ->values();

                            /* ❌ LOCK TOTAL JIKA BASIC BELUM SELESAI */
                            if (! $isBasicCompleted) {
                                return [
                                    '_id' => $pathId,
                                    'name' => $path->name,
                                    'thumbnail' => $path->thumbnail,
                                    'is_unlocked' => false,
                                    'is_selected' => false,
                                    'is_completed' => false,
                                ];
                            }

                            /* 🔒 JIKA SUDAH PILIH BRANCH */
                            if ($progress->selected_path_id) {
                                $isUnlocked = $isSelected;
                            } else {
                                /* ✅ SEMUA TERBUKA UNTUK DIPILIH */
                                $isUnlocked = true;
                            }

                            return [
                                '_id' => $pathId,
                                'name' => $path->name,
                                'thumbnail' => $path->thumbnail,
                                'is_unlocked' => $isUnlocked,
                                'is_selected' => $isSelected,
                                'is_completed' => $isCompleted,
                                'modules' => $modules->map(fn ($m) => [
                                    '_id' => (string) $m->_id,
                                    'title' => $m->title,
                                    'badge' => $m->badge ? [
                                        'icon' => $m->badge->icon,
                                    ] : null,
                                ]),
                            ];
                        }),
                ];
            });

        /* ================= RESPONSE ================= */

        return Inertia::render('Student/Roadmap', [
            'course' => [
                '_id' => (string) $course->_id,
                'title' => $course->title,
                'slug' => $course->slug,
                'basic_paths' => $basicPaths,
                'career_groups' => $careerGroups,
            ],
            'progress' => $progress,

            'badges' => LevelBadge::orderBy('order')->get()->map(fn ($b) => [
                'order' => (int) $b->order,
                'icon' => $b->icon,
            ]),

            'mentors' => User::where('role', 'mentor')->get()->map(fn ($m) => [
                '_id' => (string) $m->_id,
                'name' => $m->name,
            ]),
        ]);
    }
}
