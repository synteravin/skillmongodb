<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$userId = '69fafda821b6002d62032023';
$user = \App\Models\User::where('_id', $userId)->first();
$course = \App\Models\Course::where('_id', '69fbbeff21b6002d6203202a')->first();

$progress = \App\Models\UserStat::firstOrCreate([
    'user_id' => $user->_id,
    'course_id' => $course->_id,
], [
    'completed_modules' => [],
    'completed_paths' => [],
]);

dump('Fetched UserStat ID: '.$progress->_id);
$completedPaths = collect($progress->completed_paths ?? []);
dump('Completed Paths count: '.$completedPaths->count());

$basicPaths = \App\Models\Path::where('course_id', $course->_id)
    ->where('phase', 'basic_fundamental')
    ->pluck('id')
    ->map(fn ($id) => (string) $id);

dump('Basic Paths count: '.$basicPaths->count());
$allBasicCompleted = $basicPaths->every(fn ($id) => $completedPaths->contains($id));

dump('All Basic Completed: '.($allBasicCompleted ? 'YES' : 'NO'));
