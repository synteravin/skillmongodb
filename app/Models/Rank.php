<?php

namespace App\Models;

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
        return $this->image ? Storage::disk('s3')->url($this->image) : null;
    }
}
