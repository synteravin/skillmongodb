<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserStat extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'user_stats';

    protected $fillable = [
        'user_id',
        'course_id',
        'completed_modules',
        'completed_paths',
        'selected_path_id',
        'stage',
        'exp',
        'gold',
        'level',
        'erp',
        'path_stats' => 'array',
        'completed_career_groups',
    ];

    protected $casts = [
        'completed_modules' => 'array',
        'completed_paths' => 'array',
        'completed_career_groups' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    public function getTotalExpAttribute(): int
    {
        $totalExp = 0;
        if (is_array($this->path_stats)) {
            foreach ($this->path_stats as $pathStat) {
                $totalExp += $pathStat['exp'] ?? 0;
            }
        }

        return max((int) $this->exp, $totalExp);
    }

    public function getCurrentLevelAttribute(): int
    {
        return max((int) $this->level, floor($this->total_exp / 100) + 1);
    }
}
