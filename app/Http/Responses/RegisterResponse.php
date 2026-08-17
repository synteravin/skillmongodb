<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * @param  Request  $request
     */
    public function toResponse($request): Response
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
