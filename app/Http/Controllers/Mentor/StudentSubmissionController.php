<?php

namespace App\Http\Controllers\Mentor;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Models\CourseStudent;
use App\Models\StudentSubmission;
use App\Models\User;
use App\Models\UserStat;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        ];

        $mentor = auth()->user();
        $admin = User::where('role', 'admin')->first();

        $mentorSignature = $this->getSignatureBase64($mentor?->signature_path);
        $adminSignature = $this->getSignatureBase64($admin?->signature_path);

        // Generate Certificate
        $pdfData = [
            'studentName' => $studentSubmission->student->name,
            'assignmentTitle' => $studentSubmission->submission->title,
            'groupName' => $studentSubmission->submission->group->name ?? 'SkillMongo',
            'grade' => $validated['grade'],
            'date' => now()->format('F j, Y'),
            'mentorName' => $mentor->name,
            'adminName' => $admin->name ?? 'Guild Master',
            'mentorSignature' => $mentorSignature,
            'adminSignature' => $adminSignature,
        ];

        $pdf = Pdf::loadView('certificate', $pdfData)->setPaper('a4', 'landscape');

        $filename = 'certificates/'.$studentSubmission->id.'_certificate.pdf';
        Storage::disk('s3')->put($filename, $pdf->output(), [
            'visibility' => 'public',
        ]);

        $updateData['certificate_path'] = $filename;

        $studentSubmission->update($updateData);

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

    private function getSignatureBase64(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $disk = Storage::disk('s3');
        if ($disk->exists($path)) {
            $content = $disk->get($path);
            if ($content) {
                // Determine mime type from extension
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                $mime = 'image/'.($ext === 'jpg' ? 'jpeg' : $ext);

                return 'data:'.$mime.';base64,'.base64_encode($content);
            }
        }

        return null;
    }
}
