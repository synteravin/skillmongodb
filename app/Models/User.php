<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Authenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\UserCharacter;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Auth\Passwords\CanResetPassword;



class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Authenticatable, HasFactory, Notifiable, TwoFactorAuthenticatable, CanResetPassword;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'character_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMentor(): bool
    {
        return $this->role === 'mentor';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function character()
    {
        return $this->belongsTo(Character::class, 'character_id', '_id');
    }

    public function hasCharacter(): bool
    {
        return ! is_null($this->character_id);
    }
}
