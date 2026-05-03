<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Quiz extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quizzes';

    protected $fillable = [
        'path_id',
        'difficulty',
    ];

    public function path()
    {
        return $this->belongsTo(Path::class, 'path_id', '_id');
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class, 'quiz_id', '_id')
            ->orderBy('order');
    }
}
