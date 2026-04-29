<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class MentorCareerGroup extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'mentor_career_groups';

    protected $fillable = [
        'mentor_id',
        'career_group_id',
        'assigned_by',
    ];

    protected $casts = [
        '_id' => 'string',
        'mentor_id' => 'string',
        'career_group_id' => 'string',
        'assigned_by' => 'string',
    ];

    /* ================= RELATIONS ================= */

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id', '_id');
    }

    public function careerGroup()
    {
        return $this->belongsTo(CareerGroup::class, 'career_group_id', '_id');
    }
}