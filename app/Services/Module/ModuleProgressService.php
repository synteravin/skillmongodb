<?php

namespace App\Services\Module;

use App\Models\Module;
use App\Models\User;
use App\Models\UserStat;

class ModuleProgressService
{
    public function complete(User $user, Module $module)
    {
        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $module->path->course_id,
        ], [
            'completed_modules' => [],
            'completed_paths' => [],
            'stage' => 'fundamental',
        ]);

        // 🔥 prevent duplicate
        if (! in_array($module->_id, $progress->completed_modules)) {
            $progress->push('completed_modules', $module->_id);
        }

        // 🔥 CHECK NEXT STAGE
        if ($this->isFundamentalDone($module->path->course_id, $progress)) {
            $progress->stage = 'path';
        }

        $progress->save();

        return $progress;
    }

    private function isFundamentalDone($courseId, $progress): bool
    {
        $modules = Module::whereHas('path', function ($q) use ($courseId) {
            $q->where('course_id', $courseId)
                ->where('phase', 'fundamental');
        })->pluck('_id')->toArray();

        return empty(array_diff($modules, $progress->completed_modules));
    }
}
