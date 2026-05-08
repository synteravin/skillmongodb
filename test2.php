<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('role', 'student')->first();
$stat1 = \App\Models\UserStat::where('user_id', $user->_id)->first();
$stat2 = \App\Models\UserStat::where('user_id', (string)$user->_id)->first();

echo "Query with ObjectId: " . ($stat1 ? "FOUND" : "NOT FOUND") . "\n";
echo "Query with String: " . ($stat2 ? "FOUND" : "NOT FOUND") . "\n";
