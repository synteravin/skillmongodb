<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;


class RegisterResponse implements LoginResponseContract
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function toResponse($request)
    {
        $user = $request->user();

        // Student baru → wajib pilih character
        if ($user && $user->isStudent()) {
            return redirect()->route('character.select');
        }

        // Default (admin / mentor)
        return redirect()->intended('/dashboard');
    }
}
