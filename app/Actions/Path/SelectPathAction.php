<?php

namespace App\Actions\Student;

use App\Models\User;
use App\Models\Path;
use App\Services\Student\PathProgressService;

class SelectPathAction
{
    public function __construct(
        protected PathProgressService $service
    ) {
    }

    public function execute(User $user, Path $path)
    {
        return $this->service->select($user, $path);
    }
}