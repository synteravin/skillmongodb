<?php

namespace App\Policies;

use App\Models\User;

abstract class BasePolicy
{
    protected function admin(User $user): bool
    {
        return $user->isAdmin();
    }

    protected function mentor(User $user): bool
    {
        return $user->isMentor();
    }

    protected function student(User $user): bool
    {
        return $user->isStudent();
    }

    protected function adminOrMentor(User $user): bool
    {
        return $user->isAdmin() || $user->isMentor();
    }
}
