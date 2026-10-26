<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Path;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ModuleManagementController extends Controller
{
    public function index(Path $path)
    {
        $path->load(['quiz.questions', 'modules.contents']);

        return Inertia::render('Admin/Module/Builder', [
            'path' => [
                'id' => (string) $path->_id,
                '_id' => (string) $path->_id,
                'slug' => $path->slug ?: Str::slug($path->name),
                'name' => $path->name,
                'description' => $path->description,
                'quiz' => $path->quiz ? [
                    'id' => $path->quiz->slug ?: (string) $path->quiz->_id,
                    '_id' => (string) $path->quiz->_id,
                    'slug' => $path->quiz->slug ?: (string) $path->quiz->_id,
                    'difficulty' => $path->quiz->difficulty ?? 'medium',
                    'duration' => (int) ($path->quiz->duration ?? 15),
                    'questions_count' => $path->quiz->questions ? $path->quiz->questions->count() : 0,
                ] : null,
                'modules' => $path->modules,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $pathId = $request->path_id;

        return Inertia::render('Admin/Module/Create', [
            'pathId' => $pathId,
        ]);
    }

    public function show(Module $module)
    {
        $module->load(['contents']);

        return Inertia::render('Admin/Module/Show', [
            'module' => $module,
        ]);
    }
}
