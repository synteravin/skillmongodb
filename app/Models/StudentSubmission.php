<?php

namespace App\Models;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
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
        'graded_by',
    ];

    protected $appends = ['certificate_url'];

    public function getCertificateUrlAttribute()
    {
        if ($this->certificate_path) {
            if (str_starts_with($this->certificate_path, 'http')) {
                return $this->certificate_path;
            }

            /** @var FilesystemAdapter $disk */
            $disk = Storage::disk('s3');

            $url = $disk->url($this->certificate_path);
            $timestamp = $this->updated_at ? $this->updated_at->timestamp : time();

            return $url.'?v='.$timestamp;
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
