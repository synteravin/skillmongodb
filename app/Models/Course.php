<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';

    protected $collection = 'courses';

    protected $fillable = [

        'title',
        'slug',
        'description',
        'thumbnail',
        'mentor_id',
        'level',
        'status',
        'is_active',
        'published_at',
        'published_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['thumbnail_url'];

    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail) {
            if (str_starts_with($this->thumbnail, 'http')) {
                return $this->thumbnail;
            }

            return \Illuminate\Support\Facades\Storage::disk('s3')->url($this->thumbnail);
        }

        return null;
    }

    /* ================= RELATIONS ================= */

    public function careerGroups()
    {
        return $this->hasMany(CareerGroup::class, 'course_id')
            ->orderBy('order');
    }

    public function paths()
    {
        return $this->hasMany(Path::class, 'course_id')
            ->orderBy('order');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id', '_id');
    }

    // public function students()
    // {
    //     return $this->belongsToMany(
    //         User::class,
    //         'course_students',
    //         'course_id',
    //         'user_id'
    //     );
    // }

    public function courseStudents()
    {
        return $this->hasMany(CourseStudent::class, 'course_id', '_id');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
