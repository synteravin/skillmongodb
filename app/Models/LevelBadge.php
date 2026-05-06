<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use MongoDB\Laravel\Eloquent\Model;

class LevelBadge extends Model
{
    protected $collection = 'level_badges';

    protected $fillable = [
        'name',
        'icon',
        'order',
    ];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute()
    {
        return $this->icon ? Storage::disk('s3')->url($this->icon) : null;
    }
}
