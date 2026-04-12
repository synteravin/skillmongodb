<?php

namespace App\Services\Path;

use App\Models\User;
use App\Models\Path;
use App\Models\UserStat;


class PathProgressService
{
    public function select(User $user, Path $path)
    {
        $progress = UserStat::where([
            'user_id' => $user->_id,
            'course_id' => $path->course_id
        ])->firstOrFail();

        // ❌ belum selesai fundamental
        if ($progress->stage !== 'path') {
            throw new \Exception('Fundamental not completed');
        }

        // ❌ sudah pilih path sebelumnya
        if ($progress->selected_path_id) {
            return $progress; // tidak boleh override
        }

        $progress->selected_path_id = $path->_id;
        $progress->save();

        return $progress;
    }

    public function complete(User $user, Path $path)
    {
        $progress = UserStat::where([
            'user_id' => $user->_id,
            'course_id' => $path->course_id
        ])->firstOrFail();

        // ❌ belum pilih path
        if (!$progress->selected_path_id) {
            throw new \Exception('No path selected');
        }

        // ❌ bukan path yang dipilih
        if ($progress->selected_path_id != $path->_id) {
            throw new \Exception('Invalid path');
        }

        // 🔥 cek semua module di path selesai
        $modules = $path->modules()->pluck('_id')->toArray();

        $notDone = array_diff($modules, $progress->completed_modules);

        if (!empty($notDone)) {
            throw new \Exception('Path not completed yet');
        }

        // ✅ push completed path
        if (!in_array($path->_id, $progress->completed_paths)) {
            $progress->push('completed_paths', $path->_id);
        }

        // 🔥 FINAL STAGE
        $progress->stage = 'done';

        $progress->save();

        return $progress;
    }
}