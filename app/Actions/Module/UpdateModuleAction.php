<?php

namespace App\Actions\Module;

use App\Models\Module;

class UpdateModuleAction
{
    public function execute(Module $module, array $data)
    {
        // jika title berubah → update slug
        if (isset($data['title']) && $data['title'] !== $module->title) {

            $baseSlug = Str::slug($data['title']);
            $slug = $baseSlug;
            $count = 1;

            while (Module::where('slug', $slug)->where('_id', '!=', $module->_id)->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }

            $data['slug'] = $slug;
        }

        $module->update($data);

        return $module;
    }
}