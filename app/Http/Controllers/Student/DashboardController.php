<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
      public function index(Request $request)
    {
        $user = $request->user()->load('character');

        return Inertia::render('Student/Dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'level' => $user->level ?? 1,
                'xp' => $user->xp ?? 0,
                'hasCharacter' => $user->hasCharacter(),
                'character' => $user->character ? [
                    'name' => $user->character->name,
                    'avatar' => asset($user->character->avatar),
                    'backstory' => $user->character->backstory,
                ] : null,
            ],
        ]);
    }
}
