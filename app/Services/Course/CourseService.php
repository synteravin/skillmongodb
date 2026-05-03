<?php

namespace App\Services\Course;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\User;

class CourseService
{
    public function getCoursesForUser(User $user)
    {
        $activeCourse = CourseStudent::where('user_id', $user->_id)
            ->where('status', CourseStatus::ACTIVE->value)
            ->first();

        return Course::latest()->get()->map(function ($course) use ($user, $activeCourse) {

            $courseStudent = CourseStudent::where('user_id', $user->_id)
                ->where('course_id', $course->_id)
                ->first();

            if ($courseStudent) {
                $status = $courseStudent->status;
            } else {
                $status = $activeCourse ? CourseStatus::LOCKED->value : null;
            }

            return [
                '_id' => (string) $course->_id,
                'title' => $course->title,
                'description' => $course->description,
                'thumbnail' => $course->thumbnail,
                'slug' => $course->slug,
                'status' => $status,
            ];
        });
    }

    public function selectCourse(User $user, string $courseId)
    {
        $existing = CourseStudent::where('user_id', $user->_id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing && $existing->status === CourseStatus::COMPLETED->value) {
            return;
        }

        // 🔄 nonaktifkan course aktif
        CourseStudent::where('user_id', $user->_id)
            ->where('status', CourseStatus::ACTIVE->value)
            ->update(['status' => CourseStatus::LOCKED->value]);

        // ✅ aktifkan course baru
        CourseStudent::updateOrCreate(
            [
                'user_id' => $user->_id,
                'course_id' => $courseId,
            ],
            [
                'status' => CourseStatus::ACTIVE->value,
                'enrolled_at' => now(),
            ]
        );
    }
}
