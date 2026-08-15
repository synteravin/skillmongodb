<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class QuizAttempt extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quiz_attempts';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'started_at',
        'completed_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', '_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
