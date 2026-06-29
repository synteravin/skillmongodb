<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Path;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleManagementController extends Controller
{
    public function index(Path $path)
    {
        $path->load(['quiz', 'modules.contents']);

        return Inertia::render('Admin/Module/Builder', [
            'path' => [
                'id' => (string) $path->_id,
                '_id' => (string) $path->_id,
                'name' => $path->name,
                'description' => $path->description,
                'quiz' => $path->quiz ? [
                    'id' => (string) $path->quiz->_id,
                    '_id' => (string) $path->quiz->_id,
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
