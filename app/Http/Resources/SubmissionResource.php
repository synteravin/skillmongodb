<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'group_id' => $this->group_id,
            'title' => $this->title,
            'description' => $this->description,
            'submission_type' => $this->submission_type,
            'attachment' => $this->attachment,
            'deadline' => $this->deadline,
            'status' => $this->status,
        ];
    }
}
