<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Quest extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quests';

    protected $fillable = [
        'title',
        'description',
        'min_salary',
        'max_salary',
        'deadline',
        'status',
        'creator_id',
        'worker_id',
        'submission_link',
        'submission_note',
        'submitted_at',
        'completed_at',
        'revision_note',
        'rating',
        'rating_comment',
        'images',
        'files',
        'submission_file',
        'rejection_note',
        'revisions',
        'tier',
        'custom_rewards',
        'dispute',
        'submission_history',
    ];

    protected function casts(): array
    {
        return [
            '_id' => 'string',
            'min_salary' => 'integer',
            'max_salary' => 'integer',
            'deadline' => 'datetime',
            'creator_id' => 'string',
            'worker_id' => 'string',
            'submitted_at' => 'datetime',
            'completed_at' => 'datetime',
            'rating' => 'integer',
            'images' => 'array',
            'files' => 'array',
            'submission_file' => 'array',
            'rejection_note' => 'string',
            'revisions' => 'array',
            'tier' => 'string',
            'custom_rewards' => 'array',
            'dispute' => 'array',
            'submission_history' => 'array',
        ];
    }

    /* ================= RELATIONS ================= */

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id', '_id');
    }

    public function worker()
    {
        return $this->belongsTo(User::class, 'worker_id', '_id');
    }

    public function bids()
    {
        return $this->hasMany(QuestBid::class, 'quest_id', '_id');
    }
}
