<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use MongoDB\Laravel\Eloquent\Model;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract, MustVerifyEmailContract
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Authenticatable, Authorizable, CanResetPassword, HasFactory, MustVerifyEmailTrait, Notifiable, TwoFactorAuthenticatable;

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
        'avatar',
        'signature_path',
        'profession',
        'linkedin',
        'description',
        'user_experience',
        'work_experiences',
        'educations',
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
            '_id' => 'string',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'work_experiences' => 'array',
            'educations' => 'array',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'signature_url',
    ];

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

    public function getSignatureUrlAttribute()
    {
        if ($this->signature_path) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = \Illuminate\Support\Facades\Storage::disk('s3');
            if ($disk->exists($this->signature_path)) {
                return $disk->temporaryUrl($this->signature_path, now()->addMinutes(30));
            }
        }

        return null;
    }

    public function character()
    {
        return $this->belongsTo(Character::class, 'character_id', '_id');
    }

    public function hasCharacter(): bool
    {
        return ! is_null($this->character_id);
    }

    public function userStats()
    {
        return $this->hasMany(UserStat::class, 'user_id', '_id');
    }

    public function mentorCareerGroups()
    {
        return $this->hasMany(MentorCareerGroup::class, 'mentor_id', '_id');
    }

    public function courseStudents()
    {
        return $this->hasMany(CourseStudent::class, 'user_id', '_id');
    }

    public function activeCourse()
    {
        return $this->hasOne(CourseStudent::class, 'user_id', '_id')
            ->whereIn('status', ['in_progress', 'In_progress', 'active'])
            ->latest('updated_at');
    }

    public function notifications()
    {
        return $this->morphMany(\App\Models\Notification::class, 'notifiable')->latest();
    }

    public function readNotifications()
    {
        return $this->notifications()->read();
    }

    public function unreadNotifications()
    {
        return $this->notifications()->unread();
    }

    const ROLE_ADMIN = 'admin';

    const ROLE_MENTOR = 'mentor';

    const ROLE_STUDENT = 'student';

    public static function roles(): array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_MENTOR,
            self::ROLE_STUDENT,
        ];
    }

    public function getRouteKeyName()
    {
        return '_id';
    }
}
