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
            'name' => 'required|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'backstory' => 'required|string',
            'quote' => 'nullable|string|max:255',

            'character_type' => 'nullable|array',
            'abilities' => 'nullable|array',
            'personality' => 'nullable|array',

            'guide_power_title' => 'nullable|string|max:255',
            'guide_power_description' => 'nullable|string',

            'system_bonus' => 'nullable|array',
            'cosmetic_bonus' => 'nullable|array',

            'avatar' => 'required|image|max:2048',
        ]);

        $data['avatar'] = $uploader->upload($data['avatar']);

        // Gabungkan guide power
        $data['guide_power'] = [
            'title' => $data['guide_power_title'] ?? null,
            'description' => $data['guide_power_description'] ?? null,
        ];

        // hapus field sementara
        unset($data['guide_power_title'], $data['guide_power_description']);

        Character::create($data);

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
            'name' => 'required|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'backstory' => 'required|string',
            'quote' => 'nullable|string|max:255',

            'character_type' => 'nullable|array',
            'abilities' => 'nullable|array',
            'personality' => 'nullable|array',

            'guide_power_title' => 'nullable|string|max:255',
            'guide_power_description' => 'nullable|string',

            'system_bonus' => 'nullable|array',
            'cosmetic_bonus' => 'nullable|array',
        ]);

        $data['guide_power'] = [
            'title' => $data['guide_power_title'] ?? null,
            'description' => $data['guide_power_description'] ?? null,
        ];

        unset($data['guide_power_title'], $data['guide_power_description']);
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