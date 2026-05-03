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
        $path->load(['modules.contents']);

        return Inertia::render('Admin/Module/Builder', [
            'path' => $path,
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
