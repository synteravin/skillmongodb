<?php

namespace App\Actions\Submission;

use App\Models\CareerGroup;
use App\Models\Submission;
use App\Models\User;
use App\Services\Submission\SubmissionService;

class CreateSubmissionAction
{
    public function __construct(
        protected SubmissionService $submissionService
    ) {}

    public function execute(
        array $data,
        CareerGroup $group,
        User $user
    ): Submission {
        return Submission::create([
            'group_id' => $group->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'submission_type' => $data['submission_type'],
            'attachment' => $data['attachment'] ?? null,
            'deadline' => $data['deadline'],
            'status' => $this->submissionService->defaultStatus(),
            'created_by' => $user->id,
        ]);
    }
}
