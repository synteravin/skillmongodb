<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use MongoDB\Laravel\Eloquent\Model;

class Quest extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'quests';

    protected $fillable = [
        'title',
        'slug',
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
        'accepted_bid_amount',
        'dp_percentage',
        'dp_amount',
        'dp_proof',
        'dp_uploaded_at',
        'dp_confirmed_at',
        'rounds',
        'max_revisions',
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
            'accepted_bid_amount' => 'integer',
            'dp_percentage' => 'integer',
            'dp_amount' => 'integer',
            'deadline' => 'datetime',
            'creator_id' => 'string',
            'worker_id' => 'string',
            'submitted_at' => 'datetime',
            'completed_at' => 'datetime',
            'payment_uploaded_at' => 'datetime',
            'payment_confirmed_at' => 'datetime',
            'dp_uploaded_at' => 'datetime',
            'dp_confirmed_at' => 'datetime',
            'rating' => 'integer',
            'images' => 'array',
            'files' => 'array',
            'submission_file' => 'array',
            'payment_proof' => 'array',
            'dp_proof' => 'array',
            'rejection_note' => 'string',
            'revisions' => 'array',
            'tier' => 'string',
            'custom_rewards' => 'array',
            'rewards' => 'array',
            'dispute' => 'array',
            'submission_history' => 'array',
            'rounds' => 'array',
            'max_revisions' => 'integer',
        ];
    }

    /**
     * Accessor for rounds with backward-compatibility for legacy submission_history & revisions.
     */
    protected function rounds(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                if (! empty($value)) {
                    $decoded = is_string($value) ? json_decode($value, true) : (array) $value;
                    if (is_array($decoded) && ! empty($decoded)) {
                        return $decoded;
                    }
                }

                $history = isset($attributes['submission_history'])
                    ? (is_string($attributes['submission_history']) ? json_decode($attributes['submission_history'], true) : (array) $attributes['submission_history'])
                    : [];

                if (empty($history) && (! empty($attributes['submission_link']) || ! empty($attributes['submission_file']))) {
                    $file = isset($attributes['submission_file'])
                        ? (is_string($attributes['submission_file']) ? json_decode($attributes['submission_file'], true) : (array) $attributes['submission_file'])
                        : null;

                    $history = [
                        [
                            'version' => 1,
                            'submitted_at' => $attributes['submitted_at'] ?? null,
                            'submission_link' => $attributes['submission_link'] ?? null,
                            'submission_note' => $attributes['submission_note'] ?? null,
                            'submission_file' => $file,
                            'changelog' => null,
                        ],
                    ];
                }

                if (empty($history)) {
                    return [];
                }

                $revisions = isset($attributes['revisions'])
                    ? (is_string($attributes['revisions']) ? json_decode($attributes['revisions'], true) : (array) $attributes['revisions'])
                    : [];

                $synthesizedRounds = [];
                $questStatus = $attributes['status'] ?? 'ongoing';

                foreach ($history as $idx => $item) {
                    $roundNum = $idx + 1;
                    $hasRevision = isset($revisions[$idx]);

                    $review = null;
                    $roundStatus = 'submitted';

                    if ($hasRevision) {
                        $review = [
                            'reviewed_at' => $revisions[$idx]['created_at'] ?? null,
                            'reviewer_id' => $revisions[$idx]['author_id'] ?? null,
                            'reviewer_name' => $revisions[$idx]['author_name'] ?? 'Pembuat Quest',
                            'status' => 'changes_requested',
                            'note' => $revisions[$idx]['note'] ?? null,
                        ];
                        $roundStatus = 'changes_requested';
                    } elseif ($idx === count($history) - 1 && in_array($questStatus, ['approved', 'payment', 'delivered', 'completed'])) {
                        $review = [
                            'reviewed_at' => $attributes['completed_at'] ?? null,
                            'reviewer_id' => $attributes['creator_id'] ?? null,
                            'reviewer_name' => 'Pembuat Quest',
                            'status' => 'approved',
                            'note' => null,
                        ];
                        $roundStatus = 'approved';
                    }

                    $synthesizedRounds[] = [
                        'round_number' => $roundNum,
                        'status' => $roundStatus,
                        'submission' => [
                            'submitted_at' => $item['submitted_at'] ?? null,
                            'link' => $item['submission_link'] ?? null,
                            'note' => $item['submission_note'] ?? null,
                            'file' => $item['submission_file'] ?? null,
                            'changelog' => $item['changelog'] ?? null,
                        ],
                        'review' => $review,
                    ];
                }

                return $synthesizedRounds;
            }
        );
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

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::saving(function (Quest $quest) {
            if ($quest->isDirty('title') || empty($quest->slug)) {
                if (! empty($quest->title)) {
                    $baseSlug = Str::slug($quest->title);
                    $slug = $baseSlug;
                    $counter = 1;

                    while (static::where('slug', $slug)->where('_id', '!=', $quest->_id)->exists()) {
                        $slug = "{$baseSlug}-{$counter}";
                        $counter++;
                    }

                    $quest->slug = $slug;
                }
            }
        });
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where($field ?? 'slug', $value)
            ->orWhere('_id', $value)
            ->firstOrFail();
    }

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
