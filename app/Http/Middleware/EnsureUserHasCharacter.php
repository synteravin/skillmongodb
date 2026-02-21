<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasCharacter
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // 1. Belum login → lanjut
        if (! $user) {
            return $next($request);
        }

        // 2. Bukan student → lanjut
        if (! $user->isStudent()) {
            return $next($request);
        }

        // 3. Sudah punya character → lanjut
        if ($user->hasCharacter()) {
            return $next($request);
        }

        // 4. Jika sedang di halaman select-character → lanjut
        if ($request->routeIs('character.select') ||
            $request->routeIs('character.store')) {
            return $next($request);
        }

        // 5. Paksa redirect
        return redirect()->route('character.select');
    }
}
