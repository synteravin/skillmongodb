<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => redirect()->intended('/admin/dashboard'),
            'mentor' => redirect()->intended('/mentor/dashboard'),
            'student' => redirect()->intended('/dashboard'),
            default => redirect()->intended('/dashboard'),
        };
    }
}
