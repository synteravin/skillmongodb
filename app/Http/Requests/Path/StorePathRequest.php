<?php

namespace App\Http\Requests\Path;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\MentorCareerGroup;
use App\Models\CareerGroup;

class StorePathRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // 🔥 jangan handle auth di sini
    }

    public function rules(): array
    {
        return [
            'course_id' => ['nullable', 'string'],

            'career_group_id' => [
                'nullable',
                'string',
                'required_if:phase,career_branch'
            ],

            'phase' => [
                'nullable',
                'in:basic_fundamental,career_branch'
            ],

            'name' => ['required', 'string', 'max:255'],

            'description' => ['nullable', 'string'],
        ];
    }
}