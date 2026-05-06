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
        return Inertia::render('Admin/Assets/Badge/Index', [
            'badges' => LevelBadge::orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Assets/Badge/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer',
            'icon' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')
                ->store('badges', 's3');
        }

        LevelBadge::create($data);

        return redirect()
            ->route('admin.assets.badges.index')
            ->with('success', 'Badge created');
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
            'order' => 'required|integer',
            'icon' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('icon')) {

            // 🔥 HAPUS FILE LAMA
            if ($badge->icon) {
                Storage::disk('s3')->delete($badge->icon);
            }

            $data['icon'] = $request->file('icon')
                ->store('badges', 's3');
        }

        $badge->update($data);

        return redirect()
            ->route('admin.assets.badges.index')
            ->with('success', 'Badge updated');
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
            ->route('admin.assets.badges.index')
            ->with('success', 'Badge deleted');
    }
}
