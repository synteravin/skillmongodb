<?php

namespace App\Models;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use MongoDB\Laravel\Eloquent\Model;

class StudentSubmission extends Model
{
    protected $collection = 'student_submissions';

    protected $fillable = [
        'submission_id',
        'student_id',
        'slug',
        'file_path',
        'link',
        'notes',
        'status',
        'grade',
        'feedback',
        'certificate_path',
        'graded_by',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::saving(function (StudentSubmission $studentSubmission) {
            if (empty($studentSubmission->slug)) {
                $sub = $studentSubmission->submission ?: Submission::find($studentSubmission->submission_id);
                $student = $studentSubmission->student ?: User::find($studentSubmission->student_id);

                $subSlug = $sub?->slug ?: ($sub?->title ? Str::slug($sub->title) : 'submission');
                $userSlug = $student?->username ?: ($student?->name ? Str::slug($student->name) : 'student');

                $studentSubmission->slug = Str::slug("{$subSlug}-{$userSlug}");
            }
        });
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where($field ?? 'slug', $value)
            ->orWhere('_id', $value)
            ->firstOrFail();
    }

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
