<?php

namespace App\Http\Controllers;

use App\Actions\ModuleContent\CreateModuleContentAction;
use App\Actions\ModuleContent\DeleteModuleContentAction;
use App\Http\Requests\ModuleContent\StoreContentRequest;
use App\Models\Module;
use App\Models\ModuleContent;
use Illuminate\Http\Request;

class ModuleContentController extends Controller
{
    /* ================= STORE ================= */
    public function store(
        StoreContentRequest $request,
        Module $module,
        CreateModuleContentAction $action
    ) {
        $this->authorize('manage', Module::class);

        $action->execute($module, $request->validated());

        // 🔥 WAJIB: redirect (bukan back biasa)
        return redirect()->back()->with([
            'success' => 'Content added',
        ]);
    }

    /* ================= UPDATE ================= */
    public function update(Request $request, ModuleContent $content)
    {
        // For MongoDB, we should merge to avoid losing file URLs, names, sizes etc.
        $existingContent = $content->content ?? [];

        $updatedData = array_merge($existingContent, array_filter([
            'title' => $request->title,
            'description' => $request->description,
            'url' => $request->url, // Will overwrite only if sent
        ], fn ($val) => ! is_null($val)));

        $content->update([
            'content' => $updatedData,
        ]);

        return redirect()->back()->with([
            'success' => 'Content updated',
        ]);
    }

    /* ================= REORDER ================= */
    public function reorder(Request $request)
    {
        foreach ($request->contents as $item) {
            ModuleContent::where('_id', $item['id'])
                ->update(['order' => $item['order']]);
        }

        return back();
    }

    /* ================= DELETE ================= */
    public function destroy(
        ModuleContent $content,
        DeleteModuleContentAction $action
    ) {
        $this->authorize('manage', Module::class);

        $action->execute($content);

        return redirect()->back()->with([
            'success' => 'Content deleted',
        ]);
    }
}
