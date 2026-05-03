<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class QuizResult extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quiz_results';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'answers',
        'passed',
        'completed_at',
    ];
}
