<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use MongoDB\Laravel\Eloquent\Model;

class Quest extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quests';

    protected $fillable = [
        'title',
        'description',
        'min_budget',
        'max_budget',
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
        'rewards',
        'dispute',
        'submission_history',
        'payment_proof',
        'payment_uploaded_at',
        'payment_confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            '_id' => 'string',
            'status' => 'string',
            'min_budget' => 'integer',
            'max_budget' => 'integer',
            'min_salary' => 'integer',
            'max_salary' => 'integer',
            'deadline' => 'datetime',
            'creator_id' => 'string',
            'worker_id' => 'string',
            'submitted_at' => 'datetime',
            'completed_at' => 'datetime',
            'payment_uploaded_at' => 'datetime',
            'payment_confirmed_at' => 'datetime',
            'rating' => 'integer',
            'images' => 'array',
            'files' => 'array',
            'submission_file' => 'array',
            'payment_proof' => 'array',
            'rejection_note' => 'string',
            'revisions' => 'array',
            'tier' => 'string',
            'custom_rewards' => 'array',
            'rewards' => 'array',
            'dispute' => 'array',
            'submission_history' => 'array',
        ];
    }

    /**
     * Accessor for min_budget to fallback to min_salary if needed.
     */
    protected function minBudget(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $value ?? ($attributes['min_salary'] ?? 0),
            set: fn ($value) => ['min_budget' => (int) $value, 'min_salary' => (int) $value]
        );
    }

    /**
     * Accessor for max_budget to fallback to max_salary if needed.
     */
    protected function maxBudget(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $value ?? ($attributes['max_salary'] ?? 0),
            set: fn ($value) => ['max_budget' => (int) $value, 'max_salary' => (int) $value]
        );
    }

    /* ================= RELATIONS ================= */

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id', '_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id', '_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(QuestBid::class, 'quest_id', '_id');
    }
}
