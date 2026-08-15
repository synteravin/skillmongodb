<?php

namespace App\Http\Controllers\Student;

use App\Actions\Submission\NotifyMentorOfSubmissionAction;
use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\StudentSubmission;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index(CareerGroup $group)
    {
        // Get all published submissions for this group
        $submissions = Submission::where('group_id', (string) $group->id)
            ->where('status', 'published')
            ->latest()
            ->get();

        $submissionIds = $submissions->map(fn ($s) => (string) ($s->id ?? $s->_id))->toArray();

        // Get student's current submissions for these
        $studentSubmissions = StudentSubmission::where('student_id', (string) Auth::id())
            ->whereIn('submission_id', $submissionIds)
            ->get()
            ->keyBy(fn ($item) => (string) $item->submission_id);

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

        // Ensure we send related group and group mentor info
        $submission->load(['group.mentor']);

        // Get student's submission if exists
        $studentSubmission = StudentSubmission::where('submission_id', (string) ($submission->id ?? $submission->_id))
            ->where('student_id', (string) Auth::id())
            ->first();

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

        $subId = (string) ($submission->id ?? $submission->_id);
        $studentId = (string) Auth::id();

        $data = [
            'submission_id' => $subId,
            'student_id' => $studentId,
            'notes' => $validated['notes'] ?? null,
            'status' => 'submitted',
        ];

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store("student_submissions/{$subId}");
        }

        if (isset($validated['link'])) {
            $data['link'] = $validated['link'];
        }

        // Update or Create
        $studentSubmission = StudentSubmission::updateOrCreate(
            [
                'submission_id' => $subId,
                'student_id' => $studentId,
            ],
            $data
        );

        // Notify Mentors
        app(NotifyMentorOfSubmissionAction::class)->execute($studentSubmission, Auth::User());

        return back()->with('success', 'Your work has been submitted successfully.');
    }
}
