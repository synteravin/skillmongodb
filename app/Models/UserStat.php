<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserStat extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'user_stats';

    protected $fillable = [
        'user_id',
        'course_id',
        'completed_modules',
        'completed_paths',
        'selected_path_id',
        'stage',
        'xp',
        'level',
        'streak'
    ];

    protected $casts = [
        'completed_modules' => 'array',
        'completed_paths' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}