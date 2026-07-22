<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use MongoDB\Laravel\Eloquent\Model;

class QuestMessage extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quest_messages';

    protected $fillable = [
        'quest_bid_id',
        'sender_id',
        'message',
        'read_by',
        'file',
    ];

    protected function casts(): array
    {
        return [
            '_id' => 'string',
            'quest_bid_id' => 'string',
            'sender_id' => 'string',
            'read_by' => 'array',
            'file' => 'array',
        ];
    }

    /* ================= RELATIONS ================= */

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id', '_id');
    }

    public function bid(): BelongsTo
    {
        return $this->belongsTo(QuestBid::class, 'quest_bid_id', '_id');
    }
}
