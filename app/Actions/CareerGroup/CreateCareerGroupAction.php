<?php

namespace App\Actions\CareerGroup;

use App\Models\CareerGroup;
use Illuminate\Support\Str;

class CreateCareerGroupAction
{
    public function execute(array $data): CareerGroup
    {

        $slug = Str::slug($data['name']);

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
