<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RankController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Assets/Rank/Index', [
            'ranks' => Rank::orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Assets/Rank/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('ranks', 's3');

        // ✅ AUTO ORDER (SAFE)
        $order = (Rank::max('order') ?? 0) + 1;

        Rank::create([
            'name' => $request->name,
            'image' => $path,
            'order' => $order,
        ]);

        return redirect()->route('admin.assets.ranks.index');
    }

    public function edit(Rank $rank)
    {
        return Inertia::render('Admin/Assets/Rank/Edit', [
            'rank' => $rank,
        ]);
    }

    public function update(Request $request, Rank $rank)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = [
            'name' => $request->name,
        ];

        // ✅ HANDLE IMAGE REPLACE
        if ($request->hasFile('image')) {

            // hapus file lama
            if ($rank->image) {
                Storage::disk('s3')->delete($rank->image);
            }

            $data['image'] = $request->file('image')->store('ranks', 's3');
        }

        $rank->update($data);

        return redirect()->route('admin.assets.ranks.index');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ranks' => 'required|array',
        ]);

        foreach ($request->ranks as $rank) {
            Rank::where('_id', $rank['id'])
                ->update(['order' => $rank['order']]);
        }

        return back();
    }

    public function destroy(Rank $rank)
    {
        if ($rank->image) {
            Storage::disk('s3')->delete($rank->image);
        }

        $rank->delete();

        return redirect()->route('admin.assets.ranks.index');
    }
}
