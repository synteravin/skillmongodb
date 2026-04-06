<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Path;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Module;

class ModuleManagementController extends Controller
{
    public function index(Path $path)
    {
        $path->load(['modules.contents']);

        return Inertia::render('Admin/Module/Builder', [
            'path' => $path
        ]);
    }

    public function create(Request $request)
    {
        $pathId = $request->path_id;

        return Inertia::render('Admin/Module/Create', [
            'pathId' => $pathId
        ]);
    }

    public function show(Module $module)
    {
        $module->load(['contents']);

        return Inertia::render('Admin/Module/Show', [
            'module' => $module
        ]);
    }
}
