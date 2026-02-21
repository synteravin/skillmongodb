<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Character;
use App\Models\UserCharacter;
use Inertia\Inertia;
use App\Services\Character\AssignCharacterToUser;


class SelectCharacterController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();

    if ($user->hasCharacter()) {
        return redirect()->route('student.dashboard');
    }

    $characters = Character::all()->map(function ($character) {
        return [
            '_id' => (string) $character->_id,
            'name' => $character->name,
            'avatar' => asset($character->avatar),
            'backstory' => $character->backstory,
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
