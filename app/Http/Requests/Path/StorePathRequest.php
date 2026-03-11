<?php

namespace App\Http\Requests\Path;

use Illuminate\Foundation\Http\FormRequest;

class StorePathRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'course_id' => ['required', 'string'],

            'career_group_id' => ['nullable', 'string'],

            'phase' => ['required', 'in:basic_fundamental,career_path'],

            'name' => ['required', 'string', 'max:255'],

            'description' => ['nullable', 'string']
        ];
    }
}
