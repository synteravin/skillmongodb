<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotificationCollection;

class Notification extends Model
{
    protected $collection = 'notifications';

    protected $guarded = [];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function markAsRead()
    {
        if (is_null($this->read_at)) {
            $this->forceFill(['read_at' => $this->freshTimestamp()])->save();
        }
    }

    public function markAsUnread()
    {
        if (! is_null($this->read_at)) {
            $this->forceFill(['read_at' => null])->save();
        }
    }

    public function unread()
    {
        return $this->read_at === null;
    }

    public function read()
    {
        return $this->read_at !== null;
    }
    
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }
    
    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function newCollection(array $models = [])
    {
        return new DatabaseNotificationCollection($models);
    }
}
