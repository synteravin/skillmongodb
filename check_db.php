<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\StudentSubmission;

$all = StudentSubmission::all();
echo 'Total submissions: '.$all->count()."\n";
foreach ($all as $sub) {
    echo $sub->id.' - '.$sub->student_id.' - '.$sub->status."\n";
}
