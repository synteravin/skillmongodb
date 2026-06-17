<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$quiz = \App\Models\Quiz::first();
if ($quiz) {
    print_r($quiz->toArray());
} else {
    echo "No quiz found\n";
}
