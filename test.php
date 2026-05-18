<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courseId = '69fbbef62bc6e9140b021d7b';
$user = \App\Models\User::where('role', 'student')->first();
if (! $user) {
    echo "No student user found.\n";
    exit;
}
echo "User: {$user->name}\n";

$stats = \App\Models\UserStat::all();
echo 'Total Stats: '.$stats->count()."\n";

foreach ($stats as $stat) {
    $cidType = is_object($stat->course_id) ? get_class($stat->course_id) : gettype($stat->course_id);
    $uidType = is_object($stat->user_id) ? get_class($stat->user_id) : gettype($stat->user_id);

    echo "UserStat ID: {$stat->_id}\n";
    echo "  course_id type: {$cidType} (Value: ".(string) $stat->course_id.")\n";
    echo "  user_id type: {$uidType} (Value: ".(string) $stat->user_id.")\n";
    echo '  completed_paths: '.json_encode($stat->completed_paths)."\n";
}
