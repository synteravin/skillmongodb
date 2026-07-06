<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ForumMessage extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'forum_messages';

    protected $fillable = [
        'course_id',
        'user_id',
        'message',
        'attachments',
        'parent_id',
        'reactions',
        'is_pinned',
    ];

    protected $casts = [
        'attachments' => 'array',
        'reactions' => 'array',
        'is_pinned' => 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', '_id');
    }

    public function parent()
    {
        return $this->belongsTo(ForumMessage::class, 'parent_id', '_id');
    }
}
