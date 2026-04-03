<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Path extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'paths';

    protected $fillable = [
        'course_id',
        'career_group_id',
        'phase',
        'name',
        'slug',
        'description',
        'thumbnail',
        'order',
        // 'level_badge_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', '_id');
    }

    public function modules()
    {
        return $this->hasMany(Module::class, 'path_id', '_id')
            ->orderBy('order');
    }

    public function careerGroup()
    {
        return $this->belongsTo(CareerGroup::class, 'career_group_id');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getBadgeAttribute()
    {
        return LevelBadge::where('order', $this->order)->first();
    }

    // public function badge()
    // {
    //     return $this->belongsTo(LevelBadge::class, 'level_badge_id');
    // }
}