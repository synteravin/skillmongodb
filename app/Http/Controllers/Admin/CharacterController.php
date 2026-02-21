<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Services\Character\UploadCharacterAvatar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CharacterController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Characters/Index', [
            'characters' => Character::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Characters/Create');
    }

    public function store(Request $request, UploadCharacterAvatar $uploader)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'backstory' => 'required|string',
            'avatar'    => 'required|image|max:2048',
        ]);

        Character::create([
            'name'      => $data['name'],
            'backstory' => $data['backstory'],
            'avatar'    => $uploader->upload($data['avatar']),
        ]);

        return redirect()
            ->route('admin.characters.index')
            ->with('success', 'Character created');
    }

    public function edit(Character $character)
    {
        return Inertia::render('Admin/Characters/Edit', [
            'character' => $character,
        ]);
    }

    public function update(Request $request, Character $character)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'backstory' => 'required|string',
        ]);

        $character->update($data);

        return redirect()
            ->route('admin.characters.index')
            ->with('success', 'Character updated');
    }

    public function destroy(Character $character)
    {
        if ($character->isUsed()) {
            return back()->withErrors([
                'character' => 'Character is already used by students.',
            ]);
        }

        $character->delete();

        return back()->with('success', 'Character deleted');
    }
}
