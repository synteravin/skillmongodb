<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Services\Learns\LearnService;

class LearnController extends Controller
{
    public function show($courseId, $pathId, $moduleId, LearnService $service)
    {
        $data = $service->getData(
            auth()->user(),
            $courseId,
            $pathId,
            $moduleId
        );

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
                'completed_modules' => $data['progress']
            ],

            /* ================= META ================= */
            'meta' => $data['meta']
        ]);
    }
}