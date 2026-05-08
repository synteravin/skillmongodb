<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$collection = \Illuminate\Support\Facades\DB::collection('user_stats');
$doc = $collection->first();
dump($doc);
