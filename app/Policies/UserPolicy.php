<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->admin($user);
    }

    public function view(User $user, User $model): bool
    {
        return $this->admin($user) || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $this->admin($user);
    }

    public function update(User $user, User $model): bool
    {
        return $this->admin($user);
    }

    public function delete(User $user, User $model): bool
    {
        return $this->admin($user);
    }
}
