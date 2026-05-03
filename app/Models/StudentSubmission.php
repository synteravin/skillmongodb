<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class StudentSubmission extends Model
{
    protected $collection = 'student_submissions';

    protected $fillable = [
        'submission_id',
        'student_id',
        'file_path',
        'link',
        'notes',
        'status',
        'grade',
        'feedback',
        'certificate_path',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
