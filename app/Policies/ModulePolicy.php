<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Module;

class ModulePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function manage(User $user): bool
    {
        return in_array($user->role, ['admin', 'mentor']);
    }

    public function view(User $user): bool
    {
        return in_array($user->role, ['admin', 'mentor', 'student']);
    }
    public function complete(User $user, Module $module): bool
    {
        return $user->isStudent();
    }
}
