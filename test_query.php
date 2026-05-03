<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\StudentSubmission;

$studentId = '69ee296169a639c0720dd683'; // from earlier dump
$submissionId = '69f5390ddde3a21ef4028bc9'; // from earlier dump

$sub = StudentSubmission::where('submission_id', $submissionId)
    ->where('student_id', $studentId)
    ->first();

if ($sub) {
    echo "Found using string query!\n";
} else {
    echo "Not found using string query.\n";
}

$sub2 = StudentSubmission::where('submission_id', new MongoDB\BSON\ObjectId($submissionId))
    ->where('student_id', new MongoDB\BSON\ObjectId($studentId))
    ->first();

if ($sub2) {
    echo "Found using ObjectId query!\n";
} else {
    echo "Not found using ObjectId query.\n";
}
