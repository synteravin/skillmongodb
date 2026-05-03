<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\UserStat;
use Illuminate\Http\Request;

class CompleteModuleController extends Controller
{
    public function __invoke(Request $request, $moduleId)
    {
        $user = auth()->user();

        $moduleId = (string) $moduleId;
        $courseId = (string) $request->course_id;

        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $courseId,
        ], [
            'completed_modules' => [],
            'completed_paths' => [],
        ]);

        /* ================= MODULE ================= */

        $completedModules = $progress->completed_modules ?? [];

        if (is_string($completedModules)) {
            $completedModules = json_decode($completedModules, true) ?? [];
        }

        $completedModules = collect($completedModules)
            ->map(fn ($id) => (string) $id)
            ->toArray();

        if (! in_array($moduleId, $completedModules)) {
            $completedModules[] = $moduleId;
        }

        /* ================= SAVE ================= */

        $progress->update([
            'completed_modules' => $completedModules,
        ]);

        return back();
    }
}
