<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use MongoDB\Laravel\Eloquent\Model;

class Character extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';

    protected $collection = 'characters';

    protected $fillable = [
        'name',
        'avatar',
        'character_type',
        'tagline',
        'abilities',
        'guide_power',
        'backstory',
        'personality',
        'system_bonus',
        'cosmetic_bonus',
        'quote',
    ];

    protected $casts = [
        'character_type' => 'array',
        'abilities' => 'array',
        'guide_power' => 'array',
        'personality' => 'array',
        'system_bonus' => 'array',
        'cosmetic_bonus' => 'array',
    ];

    protected $appends = ['avatar_url'];

    public function users()
    {
        return $this->hasMany(User::class, 'character_id', '_id');
    }

    public function isUsed(): bool
    {
        return User::where('character_id', $this->_id)->exists();
    }

    public function getAvatarUrlAttribute()
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $this->avatar ? $disk->url($this->avatar) : null;
    }
}
