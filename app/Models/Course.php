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
        'mentor_id',     // user _id mentor
        'level',         // beginner | intermediate | advanced
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /* ================= RELATIONS ================= */

    /**
     * Mentor yang mengajar course ini
     */
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id', '_id');
    }

    /**
     * Student yang ikut course
     * (pivot collection: course_students)
     */
    public function students()
    {
        return $this->belongsToMany(
            User::class,
            'course_students',
            'course_id',
            'user_id'
        );
    }

    /* ================= HELPERS ================= */

    public function studentCount(): int
    {
        return $this->students()->count();
    }

    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }
}
