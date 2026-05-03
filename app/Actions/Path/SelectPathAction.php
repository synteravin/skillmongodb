<?php

namespace App\Actions\Path;

use App\Models\Path;
use App\Models\User;
use App\Services\Path\PathProgressService;

class SelectPathAction
{
    public function __construct(
        protected PathProgressService $service
    ) {}

    public function execute(User $user, Path $path)
    {
        return $this->service->select($user, $path);
    }
}
