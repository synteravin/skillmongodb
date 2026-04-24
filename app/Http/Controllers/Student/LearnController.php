<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Services\Learns\LearnService;
use App\Models\UserStat;
use App\Models\Path;

class LearnController extends Controller
{
    public function show($courseId, $pathId, $moduleId, LearnService $service)
    {
        $user = auth()->user();

        /* ================= GET DATA ================= */
        $data = $service->getData(
            $user,
            $courseId,
            $pathId,
            $moduleId
        );

        $path = $data['path'];

        /* ================= GET PROGRESS ================= */
        $progress = UserStat::firstOrCreate([
            'user_id' => $user->_id,
            'course_id' => $courseId
        ], [
            'completed_modules' => [],
            'completed_paths' => [],
            'stage' => 'fundamental',
            'selected_path_id' => null
        ]);

        /* ================= CHECK BASIC DONE ================= */
        $basicPaths = Path::where('course_id', $courseId)
            ->where('phase', 'basic_fundamental')
            ->pluck('_id')
            ->map(fn($id) => (string) $id);

        $completedPaths = collect($progress->completed_paths ?? []);

        $allBasicCompleted = $basicPaths
            ->every(fn($id) => $completedPaths->contains($id));

        /* ================= CAREER LOGIC ================= */

        if ($path->phase === 'career_branch') {

            /* ❌ BLOCK JIKA BASIC BELUM SELESAI */
            if (!$allBasicCompleted) {
                abort(403, 'Selesaikan basic fundamental terlebih dahulu');
            }

            $pathIdString = (string) $path->_id;

            /* 🔥 AUTO SELECT (FIRST CLICK) */
            if (!$progress->selected_path_id) {
                $progress->update([
                    'selected_path_id' => $pathIdString
                ]);
            }

            /* 🔒 BLOCK JIKA AKSES PATH LAIN */
            if (
                $progress->selected_path_id &&
                $progress->selected_path_id !== $pathIdString
            ) {
                abort(403, 'Kamu sudah memilih jalur career lain');
            }
        }

        /* ================= RESPONSE ================= */

        return Inertia::render('Student/Learn/Show', [

            /* ================= COURSE ================= */
            'course' => [
                '_id' => (string) $data['course']->_id,
                'title' => $data['course']->title,
                'slug' => $data['course']->slug,
            ],

            /* ================= PATH ================= */
            'path' => [
                '_id' => (string) $data['path']->_id,
                'name' => $data['path']->name,

                'final_quiz' => $data['path']->quiz ? [
                    'id' => (string) $data['path']->quiz->_id,
                ] : null,

                'modules' => $data['modules']->map(fn($m) => [
                    '_id' => (string) $m->_id,
                    'title' => $m->title,
                    'order' => $m->order,
                ]),
            ],

            /* ================= MODULE ================= */
            'module' => [
                '_id' => (string) $data['module']->_id,
                'title' => $data['module']->title,

                'contents' => $data['module']->contents->map(fn($c) => [
                    '_id' => (string) $c->_id,
                    'type' => $c->type,
                    'content' => $c->content,
                    'order' => $c->order,
                ]),
            ],

            /* ================= PROGRESS ================= */
            'progress' => [
                'completed_modules' => $data['progress'],
                'selected_path_id' => $progress->selected_path_id,
            ],

            /* ================= META ================= */
            'meta' => $data['meta']
        ]);
    }
}