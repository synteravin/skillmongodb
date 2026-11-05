<?php

namespace App\Http\Requests\LandingPage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'faqs' => ['present', 'array'],
            'faqs.*.id' => ['nullable', 'string'],
            'faqs.*.question' => ['required', 'string', 'max:255'],
            'faqs.*.answer' => ['required', 'string', 'max:2000'],
            'faqs.*.is_active' => ['boolean'],
            'faqs.*.order' => ['integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'faqs.*.question.required' => 'Setiap pertanyaan FAQ wajib diisi.',
            'faqs.*.answer.required' => 'Setiap jawaban FAQ wajib diisi.',
        ];
    }
}
