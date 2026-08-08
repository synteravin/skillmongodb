<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\Course\CourseService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentCourseController extends Controller
{
    public function index(CourseService $service)
    {
        $user = Auth::User();
        $courses = $service->getCoursesForUser($user);
        $character = $user->character;

        return Inertia::render('Student/Course/Index', [
            'courses' => $courses,
            'character' => $character ? [
                'name' => $character->name,
                'avatar' => $character->avatar_url,
            ] : null,
        ]);
    }
}
