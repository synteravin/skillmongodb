<?php

namespace App\Actions\ModuleContent;

use App\Models\ModuleContent;

class CreateModuleContentAction
{

    public function execute(array $data): ModuleContent
    {

        $order = ModuleContent::where('module_id', $data['module_id'])->max('order');

        return ModuleContent::create([

            'module_id' => $data['module_id'],

            'type' => $data['type'],

            'content' => $data['content'],

            'order' => ($order ?? 0) + 1

        ]);

    }

}