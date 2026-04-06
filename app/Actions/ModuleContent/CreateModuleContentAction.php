<?php

namespace App\Actions\ModuleContent;

use App\Models\ModuleContent;
use App\Services\Module\ModuleContentService;
use App\Models\Module;

class CreateModuleContentAction
{


    public function __construct(
        protected ModuleContentService $service
    ) {
    }

    public function execute(Module $module, array $data)
    {
        return $this->service->createSingle($module, $data);
    }

}