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

    protected $appends = ['certificate_url'];

    public function getCertificateUrlAttribute()
    {
        if ($this->certificate_path) {
            if (str_starts_with($this->certificate_path, 'http')) {
                return $this->certificate_path;
            }

            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = \Illuminate\Support\Facades\Storage::disk('s3');

            return $disk->url($this->certificate_path);
        }

        return null;
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
