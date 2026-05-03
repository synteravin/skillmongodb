<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\Course\CourseService;
use Inertia\Inertia;

class StudentCourseController extends Controller
{
    public function index(CourseService $service)
    {
        $courses = $service->getCoursesForUser(auth()->user());

        return Inertia::render('Student/Course/Index', [
            'courses' => $courses,
        ]);
    }
}
