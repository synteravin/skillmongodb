<?php

namespace App\Http\Requests\Quiz;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            /* ================= PATH ================= */
            'path_id' => ['required', 'string'],

            /* ================= QUIZ ================= */
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'duration' => ['nullable', 'integer', 'min:1'],

            /* ================= QUESTIONS ================= */
            'questions' => ['required', 'array', 'min:1'],

            'questions.*.id' => ['nullable', 'string'],

            'questions.*.media' => ['nullable', 'file'],

            'questions.*.media_url' => ['nullable', 'string'],

            'questions.*.question_text' => ['required', 'string'],

            'questions.*.explanation' => ['nullable', 'string'],

            /* ================= ANSWERS ================= */
            'questions.*.answers' => ['required', 'array', 'min:2'],

            'questions.*.answers.*.answer_text' => ['required', 'string'],

            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ];
    }

    /* ================= CUSTOM VALIDATION ================= */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {

            $questions = $this->input('questions', []);

            foreach ($questions as $index => $q) {

                $correctCount = collect($q['answers'] ?? [])
                    ->where('is_correct', true)
                    ->count();

                if ($correctCount < 1) {
                    $validator->errors()->add(
                        "questions.$index.answers",
                        'Minimal 1 jawaban benar'
                    );
                }
            }
        });
    }
}
