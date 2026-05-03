<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentSubmission;
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
                return [
                    'id' => $sub->id,
                    // Format a nice ID like "CERT-850497706"
                    'certificate_id' => strtoupper(substr(md5($sub->id), 0, 12)),
                    'course_name' => $sub->submission->group->name ?? 'SkillMongo Course',
                    'assignment_title' => $sub->submission->title,
                    'path' => $sub->certificate_path,
                ];
            });

        return Inertia::render('Student/Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }
}
