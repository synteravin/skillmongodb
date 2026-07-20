<?php

namespace App\Http\Controllers\Mentor;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Models\CourseStudent;
use App\Models\StudentSubmission;
use App\Models\UserStat;
use App\Services\CertificateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentSubmissionController extends Controller
{
    public function show(StudentSubmission $studentSubmission)
    {
        $studentSubmission->load('student', 'submission.group');

        return Inertia::render('Mentor/StudentSubmissions/Show', [
            'studentSubmission' => $studentSubmission,
        ]);
    }

    public function update(Request $request, StudentSubmission $studentSubmission)
    {
        $studentSubmission->load('student', 'submission.group');

        $validated = $request->validate([
            'grade' => 'required|integer|min:0|max:100',
            'feedback' => 'required|string',
        ]);

        $updateData = [
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'],
            'status' => 'graded',
            'graded_by' => auth()->id(),
        ];

        $studentSubmission->update($updateData);

        (new CertificateService)->generateForSubmission($studentSubmission, auth()->user());

        $courseId = $studentSubmission->submission->group->course_id;
        $groupId = $studentSubmission->submission->group_id;

        $userStat = UserStat::where('user_id', $studentSubmission->student_id)
            ->where('course_id', $courseId)
            ->first();

        if ($userStat) {
            $completedGroups = $userStat->completed_career_groups ?? [];
            if (! in_array((string) $groupId, $completedGroups)) {
                $completedGroups[] = (string) $groupId;
                $userStat->completed_career_groups = $completedGroups;
                $userStat->selected_path_id = null;
                $userStat->save();

                // Set the course as completed
                CourseStudent::where('user_id', $studentSubmission->student_id)
                    ->where('course_id', $courseId)
                    ->update([
                        'status' => CourseStatus::COMPLETED->value,
                        'completed_at' => now(),
                    ]);
            }
        }

        return back()->with('success', 'Review submitted successfully.');
    }
}
