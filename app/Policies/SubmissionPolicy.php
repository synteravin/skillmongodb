<?php

namespace App\Policies;

use App\Models\CareerGroup;
use App\Models\Submission;
use App\Models\User;

class SubmissionPolicy
{
    public function create(User $user, CareerGroup $group): bool
    {
        return true;
    }

    public function publish(User $user, Submission $submission): bool
    {
        return $user->id === $submission->created_by;
    }
}
