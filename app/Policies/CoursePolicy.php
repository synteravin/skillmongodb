<?php

namespace App\Policies;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\User;

class CoursePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function access(User $user, Course $course)
    {
        return CourseStudent::where('user_id', $user->_id)
            ->where('course_id', $course->_id)
            ->whereIn('status', [
                CourseStatus::ACTIVE->value,
                CourseStatus::COMPLETED->value,
            ])
            ->exists();
    }
}
