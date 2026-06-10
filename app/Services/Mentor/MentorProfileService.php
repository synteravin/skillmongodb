<?php

namespace App\Services\Mentor;

use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\MentorCareerGroup;
use App\Models\User;

class MentorProfileService
{
    /**
     * Get all courses assigned to this mentor.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function assignedCourses(User $mentor)
    {
        // 1. Courses where mentor is the main course mentor
        $courseIdsFromMentor = Course::where('mentor_id', $mentor->_id)->pluck('_id')->toArray();

        // 2. Career groups directly assigned to the mentor in CareerGroup model
        $courseIdsFromCareerGroupField = CareerGroup::where('mentor_id', $mentor->_id)->pluck('course_id')->toArray();

        // 3. Career groups assigned via MentorCareerGroup pivot table
        $careerGroupIds = MentorCareerGroup::where('mentor_id', $mentor->_id)->pluck('career_group_id')->toArray();
        $courseIdsFromPivot = CareerGroup::whereIn('_id', $careerGroupIds)->pluck('course_id')->toArray();

        // Merge all unique course IDs
        $allCourseIds = array_unique(array_merge(
            $courseIdsFromMentor,
            $courseIdsFromCareerGroupField,
            $courseIdsFromPivot
        ));

        return Course::whereIn('_id', $allCourseIds)->get();
    }

    /**
     * Get the total count of distinct students under guidance of this mentor.
     */
    public function totalStudentsCount(User $mentor): int
    {
        $courses = $this->assignedCourses($mentor);
        $courseIds = $courses->pluck('_id')->toArray();

        $careerGroupIds = MentorCareerGroup::where('mentor_id', $mentor->_id)->pluck('career_group_id')->toArray();

        return CourseStudent::where(function ($query) use ($courseIds, $careerGroupIds) {
            $query->whereIn('course_id', $courseIds)
                ->orWhereIn('career_group_id', $careerGroupIds);
        })->distinct('user_id')->count();
    }

    /**
     * Get compile dashboard / detail statistics for a mentor profile.
     */
    public function getProfileData(User $mentor): array
    {
        $courses = $this->assignedCourses($mentor);
        $totalStudents = $this->totalStudentsCount($mentor);

        return [
            'courses' => $courses->map(function ($c) {
                return [
                    'id' => (string) $c->_id,
                    'title' => $c->title,
                    'slug' => $c->slug,
                    'thumbnail_url' => $c->thumbnail_url,
                ];
            }),
            'stats' => [
                'total_courses' => $courses->count(),
                'total_students' => $totalStudents,
            ],
        ];
    }
}
