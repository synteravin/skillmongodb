<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::where('role', 'student')->take(1)->get();
foreach ($users as $user) {
    echo "USER: {$user->name}\n";
    $stats = \App\Models\UserStat::where('user_id', (string)$user->_id)->get();
    foreach ($stats as $stat) {
        dump($stat->toArray());
    }
}
