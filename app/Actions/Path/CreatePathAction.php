<?php

namespace App\Actions\Path;

use App\Models\Path;
use Illuminate\Support\Str;

class CreatePathAction
{

    public function execute(array $data): Path
    {

        $slug = Str::slug($data['name']);

        if (Path::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(5);
        }

        $order = Path::where('course_id', $data['course_id'])->max('order');

        return Path::create([

            'course_id' => $data['course_id'],

            'career_group_id' => $data['career_group_id'] ?? null,

            'phase' => $data['phase'],

            'name' => $data['name'],

            'slug' => $slug,

            'description' => $data['description'] ?? null,

            'thumbnail' => $data['thumbnail'] ?? null,

            'order' => ($order ?? 0) + 1

        ]);

    }

}