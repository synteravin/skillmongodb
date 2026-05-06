<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Services\Character\AssignCharacterToUser;
use Illuminate\Http\Request;

class SelectCharacterController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasCharacter() && $user->character) {
            return redirect()->route('student.dashboard');
        }

        $characters = Character::all()->map(function ($character) {
            return [
                '_id' => (string) $character->_id,
                'name' => $character->name,
                'avatar' => $character->avatar_url,
                'backstory' => $character->backstory,
                'abilities' => $character->abilities,
                'quote' => $character->quote,
                'tagline' => $character->tagline,
                'character_type' => $character->character_type,
                'guide_power' => $character->guide_power,
                'personality' => $character->personality,
                'system_bonus' => $character->system_bonus,
                'cosmetic_bonus' => $character->cosmetic_bonus,
                'is_used' => $character->isUsed(),
            ];
        });

        return inertia('Student/SelectCharacter', [
            'characters' => $characters,
        ]);
    }

    public function store(
        Request $request,
        AssignCharacterToUser $service
    ) {
        $data = $request->validate([
            'character_id' => ['required'],
        ]);

        $service->execute(
            $request->user(),
            $data['character_id']
        );

        return redirect()->route('student.dashboard');
    }
}
