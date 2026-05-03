<?php

namespace App\Services\Course;

use App\Models\Course;
use App\Models\User;
use App\Models\UserStat;

class RoadmapService
{
    public function generate(User $user, Course $course)
    {
        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $course->_id,
        ], [
            'completed_paths' => [],
            'stage' => 'fundamental',
            'selected_path_id' => null,
        ]);

        $course->load([
            'paths.modules.badge',
            'careerGroups.paths.modules.badge',
            'careerGroups.mentor',
        ]);

        return [
            'basic_paths' => $this->handleBasic($course, $progress),
            'career_groups' => $this->handleCareer($course, $progress),
            'progress' => $progress,
        ];
    }

    private function handleBasic($course, $progress)
    {
        $paths = $course->paths
            ->where('phase', 'basic_fundamental')
            ->sortBy('order')
            ->values();

        return $paths->map(function ($path, $index) use ($progress, $paths) {

            $completed = in_array((string) $path->_id, $progress->completed_paths);

            $isUnlocked = false;

            if ($index === 0) {
                $isUnlocked = true;
            } else {
                $prev = $paths[$index - 1];
                $isUnlocked = in_array((string) $prev->_id, $progress->completed_paths);
            }

            return [
                '_id' => (string) $path->_id,
                'name' => $path->name,
                'thumbnail' => $path->thumbnail,
                'is_completed' => $completed,
                'is_unlocked' => $isUnlocked,
            ];
        });
    }

    private function handleCareer($course, $progress)
    {
        $isBasicDone = $this->isBasicCompleted($course, $progress);

        return $course->careerGroups->map(function ($group) use ($progress, $isBasicDone) {

            return [
                '_id' => (string) $group->_id,
                'name' => $group->name,
                'is_unlocked' => $isBasicDone,
                'paths' => $group->paths->map(function ($path, $index) use ($progress, $isBasicDone) {

                    $selected = $progress->selected_path_id === (string) $path->_id;

                    if (! $isBasicDone) {
                        return [
                            '_id' => (string) $path->_id,
                            'is_unlocked' => false,
                        ];
                    }

                    if ($progress->selected_path_id) {
                        // 🔒 lock selain yang dipilih
                        $isUnlocked = $selected;
                    } else {
                        // semua bisa dipilih pertama kali
                        $isUnlocked = true;
                    }

                    return [
                        '_id' => (string) $path->_id,
                        'name' => $path->name,
                        'is_unlocked' => $isUnlocked,
                        'is_selected' => $selected,
                    ];
                }),
            ];
        });
    }

    private function isBasicCompleted($course, $progress)
    {
        $basicIds = $course->paths
            ->where('phase', 'basic_fundamental')
            ->pluck('_id')
            ->map(fn ($id) => (string) $id)
            ->toArray();

        return count(array_diff($basicIds, $progress->completed_paths)) === 0;
    }
}
