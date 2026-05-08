<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courseId = '69fbbeff21b6002d6203202a'; // Ensure this matches the DB
$user = \App\Models\User::where('email', 'student@example.com')->first(); // Wait, what's the user's email? Let's just find the user from the original stats!

$stats = \App\Models\UserStat::all();
dump("Total Stats: " . $stats->count());
foreach ($stats as $s) {
    dump([
        '_id' => $s->_id,
        'user_id' => (string) $s->user_id,
        'course_id' => (string) $s->course_id,
        'completed_paths_count' => count($s->completed_paths ?? []),
        'completed_paths' => $s->completed_paths
    ]);
}
