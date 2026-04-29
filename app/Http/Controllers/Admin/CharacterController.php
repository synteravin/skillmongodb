<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Services\Character\UploadCharacterAvatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CharacterController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Assets/Characters/Index', [
            'characters' => Character::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Assets/Characters/Create');
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

        // 🔥 upload avatar
        $data['avatar'] = $uploader->upload($data['avatar']);

        // 🔥 gabungkan guide power
        $data['guide_power'] = [
            'title' => $data['guide_power_title'] ?? null,
            'description' => $data['guide_power_description'] ?? null,
        ];

        unset($data['guide_power_title'], $data['guide_power_description']);

        Character::create($data);

        return redirect()
            ->route('admin.assets.characters.index')
            ->with('success', 'Character created');
    }

    public function edit(Character $character)
    {
        return Inertia::render('Admin/Assets/Characters/Edit', [
            'character' => $character,
        ]);
    }

    public function update(Request $request, Character $character, UploadCharacterAvatar $uploader)
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

            'avatar' => 'nullable|image|max:2048', // 🔥 support update avatar
        ]);

        // 🔥 handle avatar update
        if ($request->hasFile('avatar')) {

            // hapus avatar lama
            if ($character->avatar) {
                Storage::disk('public')->delete($character->avatar);
            }

            $data['avatar'] = $uploader->upload($request->file('avatar'));
        }

        // 🔥 gabungkan guide power
        $data['guide_power'] = [
            'title' => $data['guide_power_title'] ?? null,
            'description' => $data['guide_power_description'] ?? null,
        ];

        unset($data['guide_power_title'], $data['guide_power_description']);

        $character->update($data);

        return redirect()
            ->route('admin.assets.characters.index')
            ->with('success', 'Character updated');
    }

    public function destroy(Character $character)
    {
        if ($character->isUsed()) {
            return back()->withErrors([
                'character' => 'Character is already used by students.',
            ]);
        }

        // 🔥 hapus avatar
        if ($character->avatar) {
            Storage::disk('public')->delete($character->avatar);
        }

        $character->delete();

        return redirect()
            ->route('admin.assets.characters.index')
            ->with('success', 'Character deleted');
    }
}