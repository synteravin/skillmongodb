<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$userId = '69fafda821b6002d62032023';
$user = \App\Models\User::where('_id', $userId)->first();
$path = \App\Models\Path::where('phase', 'career_branch')->where('course_id', '69fbbeff21b6002d6203202a')->first();

$service = new \App\Services\Path\PathProgressService;
try {
    $progress = $service->select($user, $path);
    dump('Selected Path ID: '.$progress->selected_path_id);
    dump('Completed Paths after select: ', $progress->completed_paths);
} catch (\Exception $e) {
    dump('Error: '.$e->getMessage());
}
