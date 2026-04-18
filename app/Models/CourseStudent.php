<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CourseStudent extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'course_students';

    protected $fillable = [
        'course_id',
        'user_id',
        'status',
        'enrolled_at',
        'completed_at'
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', '_id');
    }
}