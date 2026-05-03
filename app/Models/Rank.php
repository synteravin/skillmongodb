<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Rank extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'ranks';

    protected $fillable = [
        'name',
        'image',
        'order',
    ];   //
}
