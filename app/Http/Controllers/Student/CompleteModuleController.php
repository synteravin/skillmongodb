<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserStat;
use App\Models\Path;

class CompleteModuleController extends Controller
{
    public function __invoke(Request $request, $moduleId)
    {
        $user = auth()->user();

        $moduleId = (string) $moduleId;
        $pathId = (string) $request->path_id;
        $courseId = (string) $request->course_id;

        // 🔥 ambil / buat progress
        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $courseId
        ], [
            'completed_modules' => [],
            'completed_paths' => []
        ]);

        /* ================= COMPLETED MODULE ================= */

        $completedModules = $progress->completed_modules ?? [];

        // 🔥 normalize (anti bug lama)
        if (is_string($completedModules)) {
            $completedModules = json_decode($completedModules, true) ?? [];
        }

        $completedModules = collect($completedModules)
            ->map(fn($id) => (string) $id)
            ->toArray();

        if (!in_array($moduleId, $completedModules)) {
            $completedModules[] = $moduleId;
        }

        /* ================= VALIDASI PATH ================= */

        $path = Path::with('modules')->findOrFail($pathId);

        $allModuleIds = $path->modules
            ->sortBy('order')
            ->pluck('_id')
            ->map(fn($id) => (string) $id)
            ->toArray();

        // 🔥 cek apakah SEMUA module sudah selesai
        $allCompleted = collect($allModuleIds)
            ->every(fn($id) => in_array($id, $completedModules));

        /* ================= COMPLETED PATH ================= */

        $completedPaths = $progress->completed_paths ?? [];

        if (is_string($completedPaths)) {
            $completedPaths = json_decode($completedPaths, true) ?? [];
        }

        $completedPaths = collect($completedPaths)
            ->map(fn($id) => (string) $id)
            ->toArray();

        if ($allCompleted && !in_array($pathId, $completedPaths)) {
            $completedPaths[] = $pathId;
        }

        /* ================= SAVE ================= */

        $progress->update([
            'completed_modules' => $completedModules,
            'completed_paths' => $completedPaths,
        ]);

        return back();
    }
}