<?php

namespace App\Http\Requests\Quiz;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'module_id' => ['required'],
            'difficulty' => ['required', 'in:easy,medium,hard'],

            'questions' => ['required', 'array'],
            'questions.*.media' => ['nullable', 'file'],
            'questions.*.question_text' => ['required'],
            'questions.*.answers' => ['required', 'array', 'min:2'],
            'questions.*.answers.*.answer_text' => ['required'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ];
    }
}
