<?php

namespace App\Policies;

use App\Models\CareerGroup;
use App\Models\MentorCareerGroup;
use App\Models\User;

class CareerGroupPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isMentor() || $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CareerGroup $careerGroup): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        $groups = MentorCareerGroup::where(
            'mentor_id',
            (string) $user->_id
        )->pluck('career_group_id');

        return $groups->contains((string) $careerGroup->_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CareerGroup $careerGroup): bool
    {
        return $this->view($user, $careerGroup);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CareerGroup $careerGroup): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CareerGroup $careerGroup): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CareerGroup $careerGroup): bool
    {
        return false;
    }
}
