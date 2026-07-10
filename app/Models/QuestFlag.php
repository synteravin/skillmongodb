<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class QuestFlag extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quest_flags';

    protected $fillable = [
        'reporter_id',
        'reported_user_id',
        'quest_id',
        'reason',
        'details',
        'status',
        'action_taken',
    ];

    protected function casts(): array
    {
        return [
            '_id' => 'string',
            'reporter_id' => 'string',
            'reported_user_id' => 'string',
            'quest_id' => 'string',
            'reason' => 'string',
            'details' => 'string',
            'status' => 'string',
            'action_taken' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* ================= RELATIONS ================= */

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id', '_id');
    }

    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id', '_id');
    }

    public function quest()
    {
        return $this->belongsTo(Quest::class, 'quest_id', '_id');
    }
}
