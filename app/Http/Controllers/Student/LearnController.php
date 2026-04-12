<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

use App\Models\Course;
use App\Models\Path;
use App\Models\Module;
use Inertia\Inertia;

class LearnController extends Controller
{
    public function show($courseId, $pathId, $moduleId)
    {
        // ================= COURSE =================
        $course = Course::select('_id', 'title')
            ->findOrFail($courseId);

        // ================= PATH =================
        $path = Path::where('_id', $pathId)
            ->where('course_id', $courseId)
            ->with([
                'modules' => function ($q) {
                    $q->select('_id', 'path_id', 'title', 'order')
                        ->orderBy('order');
                }
            ])
            ->firstOrFail();

        // ================= MODULE =================
        $module = Module::where('_id', $moduleId)
            ->where('path_id', $pathId)
            ->with([
                'contents' => function ($q) {
                    $q->select('_id', 'module_id', 'type', 'content', 'order')
                        ->orderBy('order');
                },
                'quiz'
            ])
            ->firstOrFail();

        return Inertia::render('Student/Learn/Show', [
            'course' => [
                '_id' => (string) $course->_id,
                'title' => $course->title,
            ],
            'path' => [
                '_id' => (string) $path->_id,
                'name' => $path->name,
                'modules' => $path->modules->map(function ($m) {
                    return [
                        '_id' => (string) $m->_id,
                        'title' => $m->title,
                        'order' => $m->order,
                    ];
                }),
            ],
            'module' => [
                '_id' => (string) $module->_id,
                'title' => $module->title,
                'contents' => $module->contents->map(function ($c) {
                    return [
                        '_id' => (string) $c->_id,
                        'type' => $c->type,
                        'content' => $c->content,
                        'order' => $c->order,
                    ];
                }),
                'quiz' => $module->quiz ? [
                    'id' => (string) $module->quiz->_id,
                ] : null,
            ],
        ]);
    }
}