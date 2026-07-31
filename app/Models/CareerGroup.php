<?php

namespace App\Models;

use Illuminate\Support\Str;
use MongoDB\Laravel\Eloquent\Model;

class CareerGroup extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'career_groups';

    protected $fillable = [
        'course_id',
        'name',
        'description',
        'mentor_id',
        'status',
        'slug',
        'order',
    ];

    protected $attributes = [
        'status' => 'draft',
    ];

    protected static function booted(): void
    {
        static::saving(function ($group) {
            if (empty($group->slug) && ! empty($group->name)) {
                $group->slug = Str::slug($group->name);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('_id', $value)
            ->orWhere('slug', $value)
            ->firstOrFail();
    }

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
