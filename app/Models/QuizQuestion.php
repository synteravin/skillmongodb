<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'quiz_questions';

    protected $fillable = [
        'quiz_id',
        'question_text',
        'media_url',
        'media_file',
        'order'
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', '_id');
    }

    public function answers()
    {
        return $this->hasMany(QuizAnswer::class, 'question_id', '_id');
    }
}