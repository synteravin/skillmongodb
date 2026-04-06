<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    public function before(User $user)
    {
        // 🔥 ADMIN = FULL AKSES (override semua method)
        if ($this->admin($user)) {
            return true;
        }
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, User $model): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, User $model): bool
    {
        return false;
    }

    public function delete(User $user, User $model): bool
    {
        return false;
    }
}