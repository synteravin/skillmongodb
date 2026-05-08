<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('role', 'student')->first();
$courseId = '69fbbeff21b6002d6203202a'; 
$course = \App\Models\Course::where('_id', $courseId)->first();

$progress = \App\Models\UserStat::firstOrCreate([
    'user_id' => $user->_id,
    'course_id' => $course->_id,
], [
    'completed_modules' => [],
    'completed_paths' => [],
]);

dump("UserStat ID: " . $progress->_id);
dump("Completed Paths: ", $progress->completed_paths);
