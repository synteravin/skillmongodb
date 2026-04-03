<?php

namespace App\Http\Controllers\Admin;

use App\Models\LevelBadge;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class LevelBadgeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/LevelBadge/Index', [
            'badges' => LevelBadge::orderBy('order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $data = $request->validate([
            'name' => 'required',
            'order' => 'required|integer',
            'icon' => 'required|image',
        ]);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')
                ->store('badges', 'public');
        }

        LevelBadge::create($data);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();

        $badge = LevelBadge::findOrFail($id);

        $data = $request->validate([
            'name' => 'required',
            'order' => 'required|integer',
            'icon' => 'nullable|image',
        ]);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')
                ->store('badges', 'public');
        }

        $badge->update($data);

        return $badge;
    }

    public function destroy($id)
    {
        $this->authorizeAdmin();

        LevelBadge::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function authorizeAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }
    }
}