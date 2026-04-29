<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CareerGroup extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'career_groups';

    protected $fillable = [
        'course_id',
        'name',
        'mentor_id',
        'slug',
        'order'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', '_id');
    }

    public function paths()
    {
        return $this->hasMany(Path::class, 'career_group_id')
            ->orderBy('order');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id', '_id');
    }

    public function mentorAssignments()
    {
        return $this->hasMany(MentorCareerGroup::class, 'career_group_id', '_id');
    }

    public function mentors()
    {
        return $this->belongsToMany(
            User::class,
            'mentor_career_groups',
            'career_group_id',
            'mentor_id'
        );
    }
}