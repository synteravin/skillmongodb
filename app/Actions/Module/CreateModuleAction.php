<?php

namespace App\Actions\Module;

use App\Models\Module;
use Illuminate\Support\Str;

class CreateModuleAction
{

    public function execute(array $data): Module
    {

        $slug = Str::slug($data['title']);

        if (Module::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(5);
        }

        $order = Module::where('path_id', $data['path_id'])->max('order');

        return Module::create([

            'path_id' => $data['path_id'],

            'type' => 'learning',

            'title' => $data['title'],

            'slug' => $slug,

            'order' => ($order ?? 0) + 1

        ]);

    }

}