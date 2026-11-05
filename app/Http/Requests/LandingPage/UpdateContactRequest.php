<?php

namespace App\Http\Requests\LandingPage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:100'],
            'subtitle' => ['required', 'string', 'max:100'],
            'description_1' => ['required', 'string', 'max:1500'],
            'description_2' => ['required', 'string', 'max:1500'],
            'support_email' => ['nullable', 'email', 'max:100'],
            'working_hours' => ['nullable', 'string', 'max:150'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul kontak wajib diisi.',
            'subtitle.required' => 'Subjudul kontak wajib diisi.',
            'description_1.required' => 'Paragraf 1 kontak wajib diisi.',
            'description_2.required' => 'Paragraf 2 kontak wajib diisi.',
            'support_email.email' => 'Format email bantuan tidak valid.',
        ];
    }
}
