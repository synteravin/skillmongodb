<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Fortify\Events\TwoFactorAuthenticationChallenged;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class SocialController extends Controller
{
    public function redirect(): SymfonyRedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        /** @var AbstractProvider $provider */
        $provider = Socialite::driver('google');

        /** @var SocialiteUser $googleUser */
        $googleUser = $provider
            ->stateless()
            ->user();

        $user = User::where('email', Str::lower($googleUser->getEmail()))->first();

        if (! $user) {
            $baseUsername = Str::slug($googleUser->getName() ?? '', '_');
            if (empty($baseUsername)) {
                $baseUsername = Str::slug(explode('@', $googleUser->getEmail())[0], '_');
            }

            $username = $baseUsername;
            $counter = 1;
            while (User::where('username', $username)->exists()) {
                $username = "{$baseUsername}_{$counter}";
                $counter++;
            }

            $user = User::create([
                'name' => $googleUser->getName(),
                'username' => $username,
                'email' => Str::lower($googleUser->getEmail()),
                'password' => Str::random(32),
                'role' => 'student',
                'character_id' => null,
            ]);
            $user->email_verified_at = now();
            $user->save();
        }

        if ($user->hasEnabledTwoFactorAuthentication()) {
            $request->session()->put([
                'login.id' => $user->getKey(),
                'login.remember' => false,
            ]);

            TwoFactorAuthenticationChallenged::dispatch($user);

            return redirect()->route('two-factor.login');
        }

        Auth::login($user);

        if ($user->isStudent() && ! $user->hasCharacter()) {
            return redirect()->route('character.select');
        }

        return redirect($this->redirectByRole($user->role));
    }

    private function redirectByRole(?string $role): string
    {
        return match ($role) {
            'admin' => '/admin/dashboard',
            'mentor' => '/mentor/dashboard',
            'student' => '/dashboard',
            default => '/dashboard',
        };
    }
}
