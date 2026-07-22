<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use MongoDB\Laravel\Eloquent\Model;

class QuestTransaction extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quest_transactions';

    protected $fillable = [
        'quest_id',
        'user_id',
        'amount',
        'type',
        'description',
    ];

    protected function casts(): array
    {
        return [
            '_id' => 'string',
            'quest_id' => 'string',
            'user_id' => 'string',
            'amount' => 'integer',
            'type' => 'string',
            'description' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* ================= RELATIONS ================= */

    public function quest(): BelongsTo
    {
        return $this->belongsTo(Quest::class, 'quest_id', '_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
