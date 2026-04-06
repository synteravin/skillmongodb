<?php

namespace App\Policies;

use App\Models\User;

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
}
