<?php

namespace App\Actions\Course;

use App\Models\Course;
use Illuminate\Support\Str;

class CreateCourseAction
{

    public function execute(array $data): Course
    {

        $slug = Str::slug($data['title']);

        if (Course::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(5);
        }

        return Course::create([
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'thumbnail' => $data['thumbnail'] ?? null,
            'mentor_id' => $data['mentor_id'] ?? null,
            'level' => $data['level'],
            'status' => 'draft',
            'is_active' => true,
        ]);
    }
}