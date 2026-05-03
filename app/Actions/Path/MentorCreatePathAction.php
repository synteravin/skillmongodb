<?php

namespace App\Actions\Path;

use App\Models\CareerGroup;
use App\Models\Path;
use Illuminate\Support\Str;

class MentorCreatePathAction
{
    public function execute(CareerGroup $group, array $data): Path
    {
        $slug = Str::slug($data['name']);

        if (Path::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::random(5);
        }

        $order = Path::where('career_group_id', $group->_id)->max('order');

        return Path::create([
            'course_id' => (string) $group->course_id,
            'career_group_id' => (string) $group->_id,
            'phase' => 'career_branch',
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'order' => ($order ?? 0) + 1,
            'is_active' => true,
        ]);
    }
}
