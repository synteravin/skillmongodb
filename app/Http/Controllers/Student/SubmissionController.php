<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\StudentSubmission;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index(CareerGroup $group)
    {
        // Get all published submissions for this group
        $submissions = Submission::where('group_id', $group->id)
            ->where('status', 'published')
            ->latest()
            ->get();

        // Get student's current submissions for these
        $studentSubmissions = StudentSubmission::where('student_id', auth()->id())
            ->whereIn('submission_id', $submissions->pluck('id'))
            ->get()
            ->keyBy('submission_id');

        return Inertia::render('Student/Submissions/Index', [
            'group' => $group,
            'submissions' => $submissions,
            'studentSubmissions' => $studentSubmissions,
        ]);
    }

    public function show(Submission $submission)
    {
        // Ensure submission is published
        if ($submission->status !== 'published') {
            abort(404);
        }

        // Get student's submission if exists
        $studentSubmission = StudentSubmission::where('submission_id', $submission->id)
            ->where('student_id', auth()->id())
            ->first();

        // Ensure we send related mentor info or group info
        $submission->load('mentor', 'group');

        return Inertia::render('Student/Submissions/Show', [
            'submission' => $submission,
            'studentSubmission' => $studentSubmission,
        ]);
    }

    public function store(Request $request, Submission $submission)
    {
        // Validate request based on submission type
        $rules = [
            'notes' => 'nullable|string',
        ];

        if ($submission->submission_type === 'file') {
            $rules['file'] = 'required|file|max:10240'; // 10MB max
        } elseif ($submission->submission_type === 'link') {
            $rules['link'] = 'required|url';
        }

        $validated = $request->validate($rules);

        $data = [
            'submission_id' => $submission->id,
            'student_id' => auth()->id(),
            'notes' => $validated['notes'] ?? null,
            'status' => 'submitted',
        ];

        // Determine if late
        if ($submission->deadline && now()->gt($submission->deadline)) {
            $data['status'] = 'late';
        }

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store("student_submissions/{$submission->id}");
        }

        if (isset($validated['link'])) {
            $data['link'] = $validated['link'];
        }

        // Update or Create
        StudentSubmission::updateOrCreate(
            [
                'submission_id' => $submission->id,
                'student_id' => auth()->id(),
            ],
            $data
        );

        return back()->with('success', 'Your work has been submitted successfully.');
    }
}
