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

        $phase = $data['phase'] ?? 'career_branch';
        $careerGroupId = $phase === 'basic_fundamental' ? null : (string) $group->_id;

        if ($phase === 'basic_fundamental') {
            $order = Path::where('course_id', (string) $group->course_id)
                ->where('phase', 'basic_fundamental')
                ->max('order');
        } else {
            $order = Path::where('career_group_id', $careerGroupId)->max('order');
        }

        return Path::create([
            'course_id' => (string) $group->course_id,
            'career_group_id' => $careerGroupId,
            'phase' => $phase,
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'order' => ($order ?? 0) + 1,
            'is_active' => true,
        ]);
    }
}
