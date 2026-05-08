<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('role', 'student')->first();
$courseId = '69fbbeff21b6002d6203202a'; // Ensure this matches the DB
$pathId = '69fc475e21b6002d62032049'; // whatever
$moduleId = '69fc483b21b6002d6203204b'; // whatever

$course = \App\Models\Course::where('_id', $courseId)->first();
dump("Course ID: " . $course->_id);

$basicPaths = \App\Models\Path::where('course_id', $course->_id)
    ->where('phase', 'basic_fundamental')
    ->pluck('_id')
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

dump("UserStat ID: " . $progress->_id);
$completedPaths = collect($progress->completed_paths ?? []);
dump("Completed Paths: ", $completedPaths->toArray());

$allBasicCompleted = $basicPaths->every(fn ($id) => $completedPaths->contains($id));
dump("All Basic Completed: " . ($allBasicCompleted ? "YES" : "NO"));

// Now check what array_diff does (which is what CourseRoadmapController uses)
$basicIdsArray = $basicPaths->toArray();
$diff = array_diff($basicIdsArray, $progress->completed_paths ?? []);
dump("Array diff count: " . count($diff));
dump("Is Basic Completed (Roadmap style): " . (count($diff) === 0 ? "YES" : "NO"));
