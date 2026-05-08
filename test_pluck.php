<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courseId = '69fbbeff21b6002d6203202a'; 
$course = \App\Models\Course::where('_id', $courseId)->first();

$pluck1 = \App\Models\Path::where('course_id', $course->_id)->pluck('_id')->toArray();
$pluck2 = \App\Models\Path::where('course_id', $course->_id)->pluck('id')->toArray();

dump("pluck _id: ", $pluck1);
dump("pluck id: ", $pluck2);
