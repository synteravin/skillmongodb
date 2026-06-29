<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LevelBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LevelBadgeController extends Controller
{
    public function index()
    {
        return redirect()->route('admin.assets.index');
    }

    public function create()
    {
        return Inertia::render('Admin/Assets/Badge/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer|min:1',
            'icon' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('badges', 's3');
        }

        LevelBadge::create($data);

        return redirect()
            ->route('admin.assets.index')
            ->with('success', 'Badge operation successful');
    }

    public function edit($id)
    {
        $badge = LevelBadge::findOrFail($id);

        return Inertia::render('Admin/Assets/Badge/Edit', [
            'badge' => $badge,
        ]);
    }

    public function update(Request $request, $id)
    {
        $badge = LevelBadge::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer|min:1',
            'icon' => 'nullable|image|max:2048',
        ]);

        // Cast order to int (MongoDB needs it as int, not string)
        $data['order'] = (int) $data['order'];

        // Remove the icon key from validated array; we handle it separately
        unset($data['icon']);

        if ($request->hasFile('icon')) {
            // 🔥 HAPUS FILE LAMA
            if ($badge->icon) {
                Storage::disk('s3')->delete($badge->icon);
            }

            $data['icon'] = $request->file('icon')->store('badges', 's3');
        }

        $badge->update($data);

        return redirect()
            ->route('admin.assets.index')
            ->with('success', 'Badge updated');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'badges' => 'required|array',
        ]);

        foreach ($request->badges as $badge) {
            LevelBadge::where('_id', $badge['id'])
                ->update(['order' => $badge['order']]);
        }

        return back();
    }

    public function destroy($id)
    {
        $badge = LevelBadge::findOrFail($id);

        // 🔥 HAPUS FILE
        if ($badge->icon) {
            Storage::disk('s3')->delete($badge->icon);
        }

        $badge->delete();

        return redirect()
            ->route('admin.assets.index')
            ->with('success', 'Badge deleted');
    }
}
