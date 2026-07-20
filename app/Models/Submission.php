<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Submission extends Model
{
    protected $collection = 'submissions';

    protected $fillable = [
        'group_id',
        'title',
        'description',
        'submission_type',
        'attachment',
        'status',
        'created_by',
    ];

    protected $casts = [];

    public function group()
    {
        return $this->belongsTo(CareerGroup::class, 'group_id');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
