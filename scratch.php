<?php

use App\Models\Quiz;

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$quiz = Quiz::first();
if ($quiz) {
    print_r($quiz->toArray());
} else {
    echo "No quiz found\n";
}
