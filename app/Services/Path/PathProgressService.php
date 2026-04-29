<?php

namespace App\Services\Path;

use App\Models\User;
use App\Models\Path;
use App\Models\UserStat;
use App\Models\CourseStudent; // ✅ FIXED
use MongoDB\BSON\ObjectId;
use App\Services\Reward\RewardService;

class PathProgressService
{
    /* ================= HELPER ================= */

    private function normalizeArray($data)
    {
        if (is_string($data)) {
            $data = json_decode($data, true) ?? [];
        }

        return collect($data)->map(function ($id) {
            if ($id instanceof ObjectId) {
                return $id->__toString();
            }
            return (string) $id;
        });
    }

    private function getIdsFromCollection($collection)
    {
        return $collection->map(function ($item) {
            if ($item->_id instanceof ObjectId) {
                return $item->_id->__toString();
            }
            return (string) $item->_id;
        });
    }

    /* ================= SELECT ================= */

    public function select(User $user, Path $path)
    {
        $progress = UserStat::where([
            'user_id' => $user->_id,
            'course_id' => $path->course_id
        ])->firstOrFail();

        /* ================= NORMALIZE ================= */

        $completedPaths = $this->normalizeArray($progress->completed_paths ?? []);

        /* ================= GET BASIC PATH ================= */

        $basicPaths = $this->getIdsFromCollection(
            Path::where('course_id', $path->course_id)
                ->where('phase', 'basic_fundamental')
                ->get()
        );

        /* ================= VALIDASI ================= */

        $allBasicCompleted = $basicPaths
            ->every(fn($id) => $completedPaths->contains($id));

        if (!$allBasicCompleted) {
            throw new \Exception('Fundamental not completed');
        }

        /* ================= SELECT ================= */

        if ($progress->selected_path_id) {
            return $progress;
        }

        // 🔥 VALIDASI CAREER GROUP
        if (!$path->career_group_id) {
            throw new \Exception('Path tidak memiliki career group');
        }

        $progress->selected_path_id = (string) $path->_id;
        $progress->stage = 'career';
        $progress->save();

        /* ================= 🔥 SYNC KE COURSE STUDENT ================= */

        $courseStudent = CourseStudent::where('user_id', (string) $user->_id)
            ->where('course_id', (string) $path->course_id)
            ->first();

        if ($courseStudent) {
            $courseStudent->update([
                'career_group_id' => (string) $path->career_group_id,
                'status' => 'active'
            ]);
        }

        return $progress;
    }

    /* ================= COMPLETE ================= */

    public function complete(User $user, Path $path)
    {
        $progress = UserStat::where([
            'user_id' => $user->_id,
            'course_id' => $path->course_id
        ])->firstOrFail();

        /* ================= NORMALIZE ================= */

        $completedModules = $this->normalizeArray($progress->completed_modules ?? []);
        $completedPaths = $this->normalizeArray($progress->completed_paths ?? []);

        /* ================= VALIDASI ================= */

        $selectedPathId = $progress->selected_path_id instanceof ObjectId
            ? $progress->selected_path_id->__toString()
            : (string) $progress->selected_path_id;

        $currentPathId = $path->_id instanceof ObjectId
            ? $path->_id->__toString()
            : (string) $path->_id;

        if (!$selectedPathId) {
            throw new \Exception('No path selected');
        }

        if ($selectedPathId !== $currentPathId) {
            throw new \Exception('Invalid path');
        }

        /* ================= MODULE CHECK ================= */

        $modules = $this->getIdsFromCollection($path->modules);

        $notDone = array_diff(
            $modules->toArray(),
            $completedModules->toArray()
        );

        if (!empty($notDone)) {
            throw new \Exception('Path not completed yet');
        }

        /* ================= COMPLETE PATH ================= */

        $reward = new RewardService();

        if (!$completedPaths->contains($currentPathId)) {
            $completedPaths->push($currentPathId);

            // 🔥 REWARD PATH (HANYA SEKALI)
            $reward->addExp($progress, $currentPathId, 50);
            $reward->addGold($progress, $currentPathId, 20);
        }

        $progress->completed_paths = $completedPaths->toArray();

        /* ================= DONE CHECK ================= */

        $careerPaths = $this->getIdsFromCollection(
            Path::where('course_id', $path->course_id)
                ->where('phase', 'career_branch')
                ->get()
        );

        $allCareerCompleted = $careerPaths
            ->every(fn($id) => $completedPaths->contains($id));

        if ($allCareerCompleted) {
            $progress->stage = 'done';
        }

        $progress->save();

        return $progress;
    }
}