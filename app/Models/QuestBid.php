<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class QuestBid extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quest_bids';

    protected $fillable = [
        'quest_id',
        'student_id',
        'bid_amount',
        'cv',
        'portfolio',
        'proposal',
        'status',
    ];

    protected function casts(): array
    {
        return [
            '_id' => 'string',
            'quest_id' => 'string',
            'student_id' => 'string',
            'bid_amount' => 'integer',
        ];
    }

    /* ================= RELATIONS ================= */

    public function quest()
    {
        return $this->belongsTo(Quest::class, 'quest_id', '_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', '_id');
    }
}
