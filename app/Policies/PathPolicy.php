<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Path;

class PathPolicy
{
    public function select(User $user, Path $path): bool
    {
        return $user->isStudent();
    }

    public function complete(User $user, Path $path): bool
    {
        return $user->isStudent();
    }
}