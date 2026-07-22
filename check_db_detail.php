<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\StudentSubmission;
use Illuminate\Contracts\Console\Kernel;

$sub = StudentSubmission::first();
dump($sub->toArray());
