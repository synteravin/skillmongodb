<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Path extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'paths';

    protected $fillable = [
        'course_id',
        'career_group_id',
        'phase', // basic_fundamental | career_branch
        'name',
        'slug',
        'description',
        'thumbnail',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /* ================= RELATIONS ================= */

    // 🔥 Path → Course
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', '_id');
    }

    // 🔥 Path → Modules (ordered)
    public function modules()
    {
        return $this->hasMany(Module::class, 'path_id', '_id')
            ->orderBy('order');
    }

    // 🔥 Path → Career Group
    public function careerGroup()
    {
        return $this->belongsTo(CareerGroup::class, 'career_group_id', '_id');
    }

    // 🔥 Path → FINAL QUIZ (WAJIB untuk sistem Anda)
    public function quiz()
    {
        return $this->hasOne(Quiz::class, 'path_id', '_id');
    }

    // 🔥 Path → Badge (berdasarkan order)
    public function badge()
    {
        return $this->belongsTo(LevelBadge::class, 'order', 'order');
    }

    /* ================= HELPERS ================= */

    public function isFundamental(): bool
    {
        return $this->phase === 'basic_fundamental';
    }

    public function isCareer(): bool
    {
        return $this->phase === 'career_branch';
    }

    /* ================= SCOPES ================= */

    public function scopeFundamental($query)
    {
        return $query->where('phase', 'basic_fundamental');
    }

    public function scopeCareer($query)
    {
        return $query->where('phase', 'career_branch');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /* ================= ROUTE KEY ================= */

    public function getRouteKeyName()
    {
        return '_id';
    }
}
