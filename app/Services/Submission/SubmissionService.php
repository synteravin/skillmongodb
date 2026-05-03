<?php

namespace App\Services\Submission;

use App\Models\Submission;

class SubmissionService
{
    public function defaultStatus(): string
    {
        return 'draft';
    }

    public function create(array $data): Submission
    {
        $data['status'] = $this->defaultStatus();

        return Submission::create($data);
    }
}
