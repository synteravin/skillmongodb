<?php

namespace App\Models;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use MongoDB\Laravel\Eloquent\Model;

class LevelBadge extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'level_badges';

    protected $fillable = [
        'name',
        'icon',
        'order',
    ];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute()
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $this->icon ? $disk->url($this->icon) : null;
    }
}
