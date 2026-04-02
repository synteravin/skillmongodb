<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Inertia\Inertia;

class StudentCourseController extends Controller
{
    public function index()
    {
        $courses = Course::latest()->get()->map(function ($course) {
            return [
                '_id' => (string) $course->_id,
                'title' => $course->title,
                'description' => $course->description,
                'thumbnail' => $course->thumbnail,
                'slug' => $course->slug,
            ];
        });

        return Inertia::render('Student/Course/Index', [
            'courses' => $courses
        ]);
    }
}