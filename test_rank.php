<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$rank = \App\Models\Rank::first();
dump($rank->name);
dump($rank->image);
dump($rank->image_url);
