<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$path1 = \App\Models\Path::where('_id', '69fc475921b6002d62032030')->first();
$path2 = \App\Models\Path::where('_id', '69fc477221b6002d62032031')->first();

dump('Path 1 Career Group ID: '.$path1->career_group_id);
dump('Path 2 Career Group ID: '.$path2->career_group_id);

$selectedPath = \App\Models\Path::where('_id', '69fc475921b6002d62032030')->first();

dump('Are they in the same group? '.($selectedPath->career_group_id === $path2->career_group_id ? 'YES' : 'NO'));
