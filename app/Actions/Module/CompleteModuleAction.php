<?php

namespace App\Actions\Module;

use App\Models\Module;
use App\Models\User;
use App\Services\Module\ModuleProgressService;

class CompleteModuleAction
{
    public function __construct(
        protected ModuleProgressService $service
    ) {}

    public function execute(User $user, Module $module)
    {
        return $this->service->complete($user, $module);
    }
}
