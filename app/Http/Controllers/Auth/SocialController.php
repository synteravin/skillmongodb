<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Two\AbstractProvider;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        /** @var AbstractProvider $provider */
        $provider = Socialite::driver('google');

        /** @var SocialiteUser $googleUser */
        $googleUser = $provider
            ->stateless()
            ->user();


        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'username' => Str::slug($googleUser->getName()) . rand(100, 999),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(Str::random(24)),
                'role' => 'student', // 🔥 default student
            ]);
        }

        Auth::login($user);

        return redirect($this->redirectByRole($user->role));
    }

    private function redirectByRole($role)
    {
        return match ($role) {
            'admin' => '/admin/dashboard',
            'mentor' => '/mentor/dashboard',
            'student' => '/student/dashboard',
            default => '/dashboard',
        };
    }
}
