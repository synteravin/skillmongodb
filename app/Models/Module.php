<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Str;

class Module extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'modules';

    protected $fillable = [
        'path_id',
        'type',
        'title',
        'slug',
        'order',
        'created_by'
    ];

    public function path()
    {
        return $this->belongsTo(Path::class, 'path_id', '_id');
    }

    public function contents()
    {
        return $this->hasMany(ModuleContent::class, 'module_id', '_id')
            ->orderBy('order');
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class, 'module_id', '_id');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}