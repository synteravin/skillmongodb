<?php

namespace App\Actions\Module;

use App\Models\User;
use App\Models\Module;
use App\Services\ModuleProgressService;

class CompleteModuleAction
{
    public function __construct(
        protected ModuleProgressService $service
    ) {
    }

    public function execute(User $user, Module $module)
    {
        return $this->service->complete($user, $module);
    }
}