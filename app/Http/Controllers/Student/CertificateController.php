<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentSubmission;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = StudentSubmission::where('student_id', auth()->id())
            ->whereNotNull('certificate_path')
            ->with('submission.group')
            ->latest()
            ->get()
            ->map(function ($sub) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('s3');

                return [
                    'id' => $sub->id,

                    'certificate_id' => strtoupper(substr(md5($sub->id), 0, 12)),

                    'course_name' => $sub->submission->group->name ??
                        'SkillMongo Course',

                    'assignment_title' => $sub->submission->title,

                    // FULL URL S3
                    'certificate_url' => $disk->url(
                        $sub->certificate_path,
                    ),
                ];
            });

        return Inertia::render('Student/Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }
}
