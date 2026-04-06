<?php

namespace App\Actions\ModuleContent;

use App\Models\ModuleContent;
use Illuminate\Support\Facades\Storage;

class DeleteModuleContentAction
{
    public function execute(ModuleContent $content)
    {
        if (isset($content->content['url'])) {
            $path = str_replace('/storage/', '', $content->content['url']);
            Storage::disk('public')->delete($path);
        }

        $content->delete();
    }
}