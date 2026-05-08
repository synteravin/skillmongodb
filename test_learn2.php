<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('role', 'student')->first();
$courseId = '69fbbeff21b6002d6203202a'; 
$course = \App\Models\Course::where('_id', $courseId)->first();

$basicPaths = \App\Models\Path::where('course_id', $course->_id)
    ->where('phase', 'basic_fundamental')
    ->pluck('id')
    ->map(fn ($id) => (string) $id);

dump("Basic Paths count: " . $basicPaths->count());
dump("Basic Paths: ", $basicPaths->toArray());

$progress = \App\Models\UserStat::firstOrCreate([
    'user_id' => $user->_id,
    'course_id' => $course->_id,
], [
    'completed_modules' => [],
    'completed_paths' => [],
]);

$completedPaths = collect($progress->completed_paths ?? []);
dump("Completed Paths: ", $completedPaths->toArray());

$allBasicCompleted = $basicPaths->every(fn ($id) => $completedPaths->contains($id));
dump("All Basic Completed: " . ($allBasicCompleted ? "YES" : "NO"));
