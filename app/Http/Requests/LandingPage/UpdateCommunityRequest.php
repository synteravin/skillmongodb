<?php

namespace App\Http\Requests\LandingPage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommunityRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'button_text' => ['required', 'string', 'max:60'],
            'discord_url' => ['required', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul ajakan gabung komunitas wajib diisi.',
            'button_text.required' => 'Label tombol komunitas wajib diisi.',
            'discord_url.required' => 'Tautan Discord / Komunitas wajib diisi.',
        ];
    }
}
