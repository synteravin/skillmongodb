<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $ip = request()?->ip() ?? 'unknown';
        $throttleKey = 'register:'.$ip;

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => [trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ])],
            ]);
        }

        RateLimiter::hit($throttleKey, 60);

        Validator::make($input, [
            ...$this->profileRules(),
            'username' => [
                'required',
                'string',
                'min:3',
                'max:30',
                'alpha_dash',
                Rule::unique(User::class, 'username'),
                Rule::notIn([
                    'admin',
                    'mentor',
                    'student',
                    'dashboard',
                    'settings',
                    'login',
                    'register',
                    'api',
                    'profile',
                    'forum',
                    'quests',
                ]),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => trim($input['name']),
            'username' => Str::lower(trim($input['username'])),
            'email' => Str::lower(trim($input['email'])),
            'password' => $input['password'],
            'role' => 'student',
            'character_id' => null,
            'email_verified_at' => app()->environment('local') ? now() : null,
        ]);
    }
}
