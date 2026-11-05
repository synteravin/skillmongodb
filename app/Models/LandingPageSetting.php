<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LandingPageSetting extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'landing_page_settings';

    protected $fillable = [
        'about',
        'vision_mission',
        'faqs',
        'community',
        'contact',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'about' => 'array',
            'vision_mission' => 'array',
            'faqs' => 'array',
            'community' => 'array',
            'contact' => 'array',
        ];
    }
}
