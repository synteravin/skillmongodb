<?php

namespace App\Actions\CareerGroup;

use App\Models\CareerGroup;
use Illuminate\Support\Str;

class CreateCareerGroupAction
{
    public function execute(array $data): CareerGroup
    {

        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (CareerGroup::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $order = CareerGroup::where('course_id', $data['course_id'])->max('order');

        return CareerGroup::create([

            'course_id' => $data['course_id'],

            'name' => $data['name'],

            'description' => $data['description'] ?? null,

            'slug' => $slug,

            'order' => ($order ?? 0) + 1,

        ]);

    }
}
