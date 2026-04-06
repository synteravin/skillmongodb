<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\User;
use MongoDB\BSON\ObjectId;

class CourseController extends Controller
{

    public function index()
    {

        $courses = Course::latest()->get();

        return Inertia::render('Admin/Course/Index', [
            'courses' => Course::with('mentor')->get()->map(function ($course) {
                return [
                    '_id' => (string) $course->_id,
                    'title' => $course->title,
                    'mentor' => $course->mentor ? [
                        '_id' => (string) $course->mentor->_id,
                        'name' => $course->mentor->name,
                    ] : null,
                    'thumbnail' => $course->thumbnail,
                    'description' => $course->description,
                    'slug' => $course->slug,
                    'status' => $course->status,
                    'is_active' => $course->is_active,
                    'created_at' => $course->created_at,
                    'updated_at' => $course->updated_at,
                ];
            }),

            'mentors' => User::where('role', 'mentor')->get()->map(fn($m) => [
                '_id' => (string) $m->_id,
                'name' => $m->name,
            ])
        ]);

    }

    public function create()
    {

        return Inertia::render('Admin/Course/Create');

    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
        ]);

        /* ---------- SLUG ---------- */

        $slug = Str::slug($data['title']);

        if (Course::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(4);
        }

        /* ---------- UPLOAD THUMBNAIL ---------- */

        $thumbnailPath = null;

        if ($request->hasFile('thumbnail')) {

            $thumbnailPath = $request
                ->file('thumbnail')
                ->store('courses', 'public');

        }

        /* ---------- CREATE COURSE ---------- */

        $course = Course::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'thumbnail' => $thumbnailPath,
            'slug' => $slug,
            'status' => 'draft',
            'is_active' => true
        ]);

        return redirect()->route('admin.courses.builder', $course->slug);
    }

    public function edit(Course $course)
    {

        return Inertia::render('Admin/Course/Edit', [
            'course' => $course
        ]);

    }

    public function update(Request $request, Course $course)
    {

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
        ]);

        $thumbnail = $course->thumbnail;

        if ($request->hasFile('thumbnail')) {

            $thumbnail = $request
                ->file('thumbnail')
                ->store('courses', 'public');

        }

        $course->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'thumbnail' => $thumbnail
        ]);

        return redirect()->route('admin.courses.index');

    }

    public function destroy(Course $course)
    {

        $course->delete();

        return redirect()->back();

    }

    public function assignMentor(Request $request, $course)
    {
        $course = Course::where('_id', new ObjectId($course))->firstOrFail();

        $data = $request->validate([
            'mentor_id' => ['required']
        ]);

        $mentor = User::where('_id', $data['mentor_id'])
            ->where('role', 'mentor')
            ->firstOrFail();

        $course->update([
            'mentor_id' => $mentor->_id
        ]);

        return back();
    }
}