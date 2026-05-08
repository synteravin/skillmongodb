<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('role', 'student')->first();
$courseId = '69fbbeff21b6002d6203202a'; 
$course = \App\Models\Course::where('_id', $courseId)->first();

$statWithString = \App\Models\UserStat::where('user_id', (string)$user->_id)
                                      ->where('course_id', (string)$course->_id)->first();

$statWithObjectId = \App\Models\UserStat::where('user_id', $user->_id)
                                        ->where('course_id', $course->_id)->first();

dump("Stat with String ID: " . ($statWithString ? $statWithString->_id : 'null'));
dump("Stat with ObjectId: " . ($statWithObjectId ? $statWithObjectId->_id : 'null'));
