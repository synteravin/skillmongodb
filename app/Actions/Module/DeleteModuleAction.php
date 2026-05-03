<?php

namespace App\Actions\Module;

use App\Models\Module;
use App\Models\ModuleContent;

class DeleteModuleAction
{
    public function execute(Module $module)
    {
        ModuleContent::where('module_id', $module->_id)->delete();

        $module->delete();
    }
}
