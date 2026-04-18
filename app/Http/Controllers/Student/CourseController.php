<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Course\CourseService;

class CourseController extends Controller
{
    public function select(Request $request, CourseService $service)
    {
        $service->selectCourse(auth()->user(), $request->course_id);

        return redirect()->route('student.courses.roadmap', [
            'course' => $request->slug
        ]);
    }
}
