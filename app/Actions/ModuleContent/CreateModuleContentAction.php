<?php

namespace App\Actions\ModuleContent;

use App\Models\Module;
use App\Services\Module\ModuleContentService;

class CreateModuleContentAction
{
    public function __construct(
        protected ModuleContentService $service
    ) {}

    public function execute(Module $module, array $data)
    {
        return $this->service->createSingle($module, $data);
    }
}
