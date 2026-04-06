<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\JsonResponse;

use App\Actions\Module\CreateModuleAction;
use App\Actions\Module\UpdateModuleAction;
use App\Actions\Module\DeleteModuleAction;
use App\Services\Module\ModuleContentService;

use App\Http\Requests\Module\StoreModuleRequest;
use App\Http\Requests\Module\UpdateModuleRequest;

class ModuleController extends Controller
{
    public function store(
        StoreModuleRequest $request,
        CreateModuleAction $action
    ) {

        $this->authorize('manage', Module::class);

        $action->execute([
            ...$request->validated(),
            'created_by' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Module created');
    }

    public function update(
        UpdateModuleRequest $request,
        Module $module,
        UpdateModuleAction $action,
        ModuleContentService $contentService
    ): JsonResponse {

        $this->authorize('manage', Module::class);

        $module = $action->execute($module, $request->validated());

        if ($request->has('contents')) {
            $contentService->createContents($module, $request->contents);
        }

        return response()->json(
            $module->load('contents')
        );
    }

    public function destroy(
        Module $module,
        DeleteModuleAction $action
    ): JsonResponse {

        $this->authorize('manage', Module::class);

        $action->execute($module);

        return response()->json([
            'message' => 'Module deleted'
        ]);
    }
}