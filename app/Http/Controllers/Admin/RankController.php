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
        return redirect()->route('admin.assets.index');
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
        $order = (int) ((Rank::max('order') ?? 0) + 1);

        Rank::create([
            'name' => $request->name,
            'image' => $path,
            'order' => $order,
        ]);

        return redirect()->route('admin.assets.index', ['tab' => 'ranks'])
            ->with('success', 'Rank berhasil ditambahkan.');
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

        return redirect()->route('admin.assets.index', ['tab' => 'ranks'])
            ->with('success', 'Rank berhasil diperbarui.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ranks' => 'required|array',
            'ranks.*.id' => 'required|string',
            'ranks.*.order' => 'required|integer',
        ]);

        foreach ($request->ranks as $rank) {
            Rank::where('_id', $rank['id'])
                ->update(['order' => (int) $rank['order']]);
        }

        return back()->with('success', 'Urutan rank berhasil diperbarui.');
    }

    public function destroy(Rank $rank)
    {
        if ($rank->image) {
            Storage::disk('s3')->delete($rank->image);
        }

        $rank->delete();

        return redirect()->route('admin.assets.index', ['tab' => 'ranks'])
            ->with('success', 'Rank berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'string',
        ]);

        $ranks = Rank::whereIn('_id', $request->ids)->get();
        $count = 0;

        foreach ($ranks as $rank) {
            if ($rank->image) {
                Storage::disk('s3')->delete($rank->image);
            }
            $rank->delete();
            $count++;
        }

        return redirect()->route('admin.assets.index', ['tab' => 'ranks'])
            ->with('success', "{$count} rank berhasil dihapus.");
    }
}
