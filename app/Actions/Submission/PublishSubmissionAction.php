<?php

namespace App\Actions\Submission;

use App\Models\Submission;
use Exception;

class PublishSubmissionAction
{
    public function execute(Submission $submission): Submission
    {
        if (
            empty($submission->title) ||
            empty($submission->description) ||
            empty($submission->submission_type)
        ) {
            throw new Exception('Submission data incomplete.');
        }

        $submission->update([
            'status' => 'published',
        ]);

        return $submission;
    }
}
