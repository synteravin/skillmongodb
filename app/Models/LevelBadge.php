<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LevelBadge extends Model
{
    protected $collection = 'level_badges';

    protected $fillable = [
        'name',
        'icon',
        'order',
    ];
}
