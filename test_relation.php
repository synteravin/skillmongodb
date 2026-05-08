<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courseId = '69fbbeff21b6002d6203202a';
$course = \App\Models\Course::where('_id', $courseId)->first();

$pathsCount = $course->paths->count();
dump("Course paths relation count: " . $pathsCount);

$basicPathsCount = $course->paths->where('phase', 'basic_fundamental')->count();
dump("Course basic paths count: " . $basicPathsCount);
