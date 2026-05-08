<?php

namespace App\Services\Learns;

use App\Models\Course;
use App\Models\Module;
use App\Models\Path;
use App\Models\UserStat;

class LearnService
{
    public function getData($user, $courseId, $pathId, $moduleId)
    {
        /* ================= NORMALIZE ID ================= */
        $courseId = (string) $courseId;
        $pathId = (string) $pathId;
        $moduleId = (string) $moduleId;

        /* ================= COURSE ================= */
        $course = Course::select('_id', 'title', 'slug')
            ->where('_id', $courseId)
            ->firstOrFail();

        /* ================= PATH ================= */
        $path = Path::where('_id', $pathId)
            ->where('course_id', $courseId)
            ->with([
                'modules' => function ($q) {
                    $q->select('_id', 'path_id', 'title', 'order')
                        ->orderBy('order');
                },
                'quiz',
            ])
            ->firstOrFail();

        /* ================= MODULE ================= */
        $module = Module::where('_id', $moduleId)
            ->where('path_id', $pathId)
            ->with([
                'contents' => function ($q) {
                    $q->select('_id', 'module_id', 'type', 'content', 'order')
                        ->orderBy('order');
                },
            ])
            ->firstOrFail();

        /* ================= PROGRESS ================= */
        $progress = UserStat::firstOrCreate(
            [
                'user_id' => $user->_id,
                'course_id' => $course->_id,
            ],
            [
                'completed_modules' => [],
                'completed_paths' => [],
            ]
        );

        $completedModules = $this->normalize($progress->completed_modules);

        /* ================= MODULE LIST ================= */
        $modules = $path->modules->values();

        $currentIndex = $modules->search(
            fn ($m) => (string) $m->_id === (string) $module->_id
        );

        /* ================= META ================= */
        $meta = [
            'current_index' => $currentIndex,
            'is_last_module' => $currentIndex === ($modules->count() - 1),
            'total_modules' => $modules->count(),
        ];

        /* ================= RETURN ================= */
        return [
            'course' => $course,
            'path' => $path,
            'module' => $module,
            'modules' => $modules,
            'progress' => $completedModules,
            'meta' => $meta,
        ];
    }

    private function normalize($data)
    {
        if (is_string($data)) {
            $data = json_decode($data, true) ?? [];
        }

        return collect($data)
            ->map(fn ($id) => (string) $id)
            ->toArray();
    }
}
