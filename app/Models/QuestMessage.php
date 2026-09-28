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
        'channel_type',
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
            'channel_type' => 'string',
            'file' => 'array',
        ];
    }

    public function getReadByAttribute($value): array
    {
        if (is_array($value)) {
            return array_map('strval', array_values($value));
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);

            return is_array($decoded) ? array_map('strval', array_values($decoded)) : [];
        }

        return [];
    }

    public function setReadByAttribute($value): void
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            $this->attributes['read_by'] = is_array($decoded)
                ? array_map('strval', array_values($decoded))
                : [(string) $value];
        } elseif (is_array($value)) {
            $this->attributes['read_by'] = array_map('strval', array_values($value));
        } else {
            $this->attributes['read_by'] = [];
        }
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
