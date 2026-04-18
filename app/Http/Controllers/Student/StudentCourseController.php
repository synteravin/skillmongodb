<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Inertia\Inertia;
use App\Models\CourseStudent;
use App\Enums\CourseStatus;
use App\Services\Course\CourseService;

class StudentCourseController extends Controller
{
    public function index(CourseService $service)
    {
        $courses = $service->getCoursesForUser(auth()->user());

        return Inertia::render('Student/Course/Index', [
            'courses' => $courses
        ]);
    }

}