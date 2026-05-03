<?php

namespace App\Http\Requests\Quiz;

use Illuminate\Foundation\Http\FormRequest;

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
            'path_id' => ['required', 'string', 'exists:paths,_id'],

            /* ================= QUIZ ================= */
            'difficulty' => ['required', 'in:easy,medium,hard'],

            /* ================= QUESTIONS ================= */
            'questions' => ['required', 'array', 'min:1'],

            'questions.*.media' => ['nullable', 'file'],

            'questions.*.question_text' => ['required', 'string'],

            /* ================= ANSWERS ================= */
            'questions.*.answers' => ['required', 'array', 'min:2'],

            'questions.*.answers.*.answer_text' => ['required', 'string'],

            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ];
    }

    /* ================= CUSTOM VALIDATION ================= */
    public function withValidator($validator)
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

                if ($correctCount > 1) {
                    $validator->errors()->add(
                        "questions.$index.answers",
                        'Hanya boleh 1 jawaban benar'
                    );
                }
            }
        });
    }
}
