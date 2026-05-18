<?php

namespace App\Actions\Submission;

use App\Models\StudentSubmission;
use App\Models\Submission;
use App\Models\CareerGroup;
use App\Models\User;
use App\Notifications\StudentSubmissionNotification;

class NotifyMentorOfSubmissionAction
{
    public function execute(StudentSubmission $studentSubmission, User $student): void
    {
        $submission = Submission::find($studentSubmission->submission_id);
        if (!$submission) {
            return;
        }

        $careerGroup = CareerGroup::with('mentors')->find($submission->group_id);
        if (!$careerGroup) {
            return;
        }

        $mentors = clone $careerGroup->mentors;
        
        if ($careerGroup->mentor_id) {
            $primaryMentor = User::find($careerGroup->mentor_id);
            if ($primaryMentor && !$mentors->contains('_id', $primaryMentor->_id)) {
                $mentors->push($primaryMentor);
            }
        }

        foreach ($mentors as $mentor) {
            $mentor->notify(new StudentSubmissionNotification(
                (string) $studentSubmission->_id,
                $student->name,
                $submission->title ?? 'Tugas',
                $careerGroup->name ?? 'Career Path'
            ));
        }
    }
}
