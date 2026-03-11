<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class QuizAnswer extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'quiz_answers';

    protected $fillable = [
        'question_id',
        'answer_text',
        'is_correct'
    ];

    protected $casts = [
        'is_correct' => 'boolean'
    ];

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id', '_id');
    }
}