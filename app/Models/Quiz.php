<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Quiz extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quizzes';

    protected $fillable = [
        'path_id',
        'slug',
        'difficulty',
        'duration',
    ];

    protected function casts(): array
    {
        return [
            'duration' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function ($quiz) {
            if ($quiz->path && $quiz->path->slug) {
                $quiz->slug = $quiz->path->slug;
            }
        });
    }

    public function path()
    {
        return $this->belongsTo(Path::class, 'path_id', '_id');
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class, 'quiz_id', '_id')
            ->orderBy('order');
    }

    /* ================= ROUTE KEY ================= */

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where($field ?? 'slug', $value)
            ->orWhere('_id', $value)
            ->orWhereHas('path', fn ($q) => $q->where('slug', $value))
            ->firstOrFail();
    }
}
