<?php

namespace App\Actions\Submission;

use App\Models\CareerGroup;
use App\Models\MentorCareerGroup;
use App\Models\StudentSubmission;
use App\Models\Submission;
use App\Models\User;
use App\Notifications\StudentSubmissionNotification;
use Illuminate\Support\Facades\Log;
use Throwable;

class NotifyMentorOfSubmissionAction
{
    public function execute(StudentSubmission $studentSubmission, User $student): void
    {
        $submission = Submission::find($studentSubmission->submission_id);
        if (! $submission) {
            return;
        }

        $careerGroup = CareerGroup::find($submission->group_id);
        if (! $careerGroup) {
            return;
        }

        // Ambil mentor dari MentorCareerGroup (karena belongsToMany terkadang bermasalah di MongoDB)
        $mentorIds = MentorCareerGroup::where('career_group_id', $careerGroup->id)
            ->pluck('mentor_id')
            ->toArray();

        // Tambahkan juga mentor_id bawaan dari grup jika ada
        if ($careerGroup->mentor_id) {
            $mentorIds[] = $careerGroup->mentor_id;
        }

        $mentorIds = array_unique(array_filter($mentorIds));

        // Ambil data User mentor
        $mentors = User::whereIn('_id', $mentorIds)->get();

        foreach ($mentors as $mentor) {
            // Tandai notifikasi submission lama yang masih unread untuk submission ini sebagai read
            // agar tidak terjadi penumpukan antrian jika student mengupdate tugas berulang kali
            try {
                $mentor->unreadNotifications()
                    ->where('data.student_submission_id', (string) $studentSubmission->_id)
                    ->get()
                    ->each(fn ($n) => $n->markAsRead());
            } catch (Throwable $e) {
                // Abaikan jika ada kegagalan query notifikasi
            }

            try {
                /** @var User $mentor */
                $mentor->notify(new StudentSubmissionNotification(
                    (string) $studentSubmission->_id,
                    $student->name,
                    $submission->title ?? 'Tugas',
                    $careerGroup->name ?? 'Career Path'
                ));
            } catch (Throwable $e) {
                Log::error('Failed to notify mentor of submission: '.$e->getMessage(), [
                    'mentor_id' => (string) $mentor->_id,
                    'student_submission_id' => (string) $studentSubmission->_id,
                ]);
            }
        }
    }
}
