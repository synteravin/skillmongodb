<?php

namespace App\Actions\CareerGroup;

use App\Models\CareerGroup;
use Illuminate\Support\Str;

class CreateCareerGroupAction
{
    public function execute(array $data): CareerGroup
    {

        $slug = Str::slug($data['name']);

        if (CareerGroup::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::random(5);
        }

        $order = CareerGroup::where('course_id', $data['course_id'])->max('order');

        return CareerGroup::create([

            'course_id' => $data['course_id'],

            'name' => $data['name'],

            'slug' => $slug,

            'order' => ($order ?? 0) + 1,

        ]);

    }
}
