<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'published_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime'
    ];

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

    public function students()
    {
        return $this->belongsToMany(
            User::class,
            'course_students',
            'course_id',
            'user_id'
        );
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}