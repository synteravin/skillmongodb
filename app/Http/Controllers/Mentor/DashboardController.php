<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;

class DashboardController extends Controller
{
public function index(Request $request)
{
    $mentor = $request->user();

    $courses = Course::where('mentor_id', $mentor->_id)->get();

    return Inertia::render('Mentor/Dashboard', [
        'mentor' => [
            'name' => $mentor->name,
            'stats' => [
                'courses' => $courses->count(),
                'students' => 0,
                'active' => 0,
                'progress' => 0,
            ],
            // ⬇️ PASTIKAN INI SELALU ARRAY
            'courses' => $courses->map(fn ($course) => [
                'id' => (string) $course->_id,
                'title' => $course->title,
                'students' => 0,
                'progress' => 0,
            ])->values()->all(),
        ],
    ]);
}


}
