<?php

namespace App\Models;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use MongoDB\Laravel\Eloquent\Model;

class Rank extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'ranks';

    protected $fillable = [
        'name',
        'image',
        'order',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $this->image ? $disk->url($this->image) : null;
    }
}
