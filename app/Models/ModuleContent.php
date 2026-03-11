<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ModuleContent extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'module_contents';

    protected $fillable = [
        'module_id',
        'type',
        'content',
        'order'
    ];

    protected $casts = [
        'content' => 'array'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id', '_id');
    }
}