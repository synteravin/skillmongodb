<?php

namespace App\Models;

use Illuminate\Support\Str;
use MongoDB\Laravel\Eloquent\Model;

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
        'created_by',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
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

    public function badge()
    {
        return $this->belongsTo(LevelBadge::class, 'badge_id', '_id');
    }

    protected static function booted(): void
    {
        static::saving(function ($module) {
            if (empty($module->slug) && ! empty($module->title)) {
                $module->slug = Str::slug($module->title);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where($field ?? 'slug', $value)
            ->orWhere('_id', $value)
            ->firstOrFail();
    }
}
