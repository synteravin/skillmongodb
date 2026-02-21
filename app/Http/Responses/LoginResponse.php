<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        return match ($user->role) {
            'admin'   => redirect()->intended('/admin/dashboard'),
            'mentor'  => redirect()->intended('/mentor/dashboard'),
            'student' => redirect()->intended('/student/dashboard'),
            default   => redirect()->intended('/dashboard'),
        };
    }
}
