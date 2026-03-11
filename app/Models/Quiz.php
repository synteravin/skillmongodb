<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Quiz extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'quizzes';

    protected $fillable = [
        'module_id',
        'difficulty'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id', '_id');
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class, 'quiz_id', '_id')
            ->orderBy('order');
    }
}