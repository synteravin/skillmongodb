<?php

namespace App\Http\Requests\CareerGroup;

use Illuminate\Foundation\Http\FormRequest;

class StoreCareerGroupRequest extends FormRequest
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

            'name' => ['required', 'string', 'max:255']
        ];
    }
}
