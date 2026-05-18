<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courseId = '69fbbeff21b6002d6203202a';
$course = \App\Models\Course::where('_id', $courseId)->first();

$rawBasicPaths = \App\Models\Path::where('course_id', $course->_id)
    ->where('phase', 'basic_fundamental')
    ->get();

dump('Count: '.$rawBasicPaths->count());
foreach ($rawBasicPaths as $p) {
    dump([
        'id' => $p->_id,
        'id_class' => is_object($p->_id) ? get_class($p->_id) : gettype($p->_id),
        'course_id' => $p->course_id,
        'course_id_class' => is_object($p->course_id) ? get_class($p->course_id) : gettype($p->course_id),
    ]);
}
