<?php

namespace App\Services\Mentor;

use App\Models\CareerGroup;
use App\Models\CourseStudent;
use App\Models\MentorCareerGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class MentorProfileService
{
    /**
     * Get all CareerGroups assigned to this mentor.
     *
     * @return Collection
     */
    public function assignedCareerGroups(User $mentor)
    {
        // 1. Career groups directly assigned via CareerGroup.mentor_id field
        $directIds = CareerGroup::where('mentor_id', $mentor->_id)
            ->pluck('_id')
            ->toArray();

        // 2. Career groups assigned via MentorCareerGroup pivot table
        $pivotIds = MentorCareerGroup::where('mentor_id', $mentor->_id)
            ->pluck('career_group_id')
            ->toArray();

        $allIds = array_unique(array_merge($directIds, $pivotIds));

        return CareerGroup::whereIn('_id', $allIds)->get();
    }

    /**
     * Get the total count of distinct students under guidance of this mentor.
     */
    public function totalStudentsCount(User $mentor): int
    {
        $careerGroups = $this->assignedCareerGroups($mentor);
        $careerGroupIds = $careerGroups->pluck('_id')->toArray();

        return CourseStudent::whereIn('career_group_id', $careerGroupIds)
            ->distinct('user_id')
            ->count();
    }

    /**
     * Compile profile statistics and career branch data for a mentor.
     */
    public function getProfileData(User $mentor): array
    {
        $careerGroups = $this->assignedCareerGroups($mentor);
        $totalStudents = $this->totalStudentsCount($mentor);

        return [
            'career_groups' => $careerGroups->map(function ($group) {
                return [
                    'id' => (string) $group->_id,
                    'name' => $group->name,
                    'description' => $group->description ?? null,
                    'slug' => $group->slug,
                ];
            })->values()->toArray(),
            'stats' => [
                'total_career_groups' => $careerGroups->count(),
                'total_students' => $totalStudents,
            ],
        ];
    }
}
