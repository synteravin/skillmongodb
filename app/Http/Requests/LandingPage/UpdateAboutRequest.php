<?php

namespace App\Http\Requests\LandingPage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutRequest extends FormRequest
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
            'badge_title' => ['required', 'string', 'max:50'],
            'card_1_title' => ['required', 'string', 'max:100'],
            'card_1_text' => ['required', 'string', 'max:1500'],
            'card_2_title' => ['required', 'string', 'max:100'],
            'card_2_text' => ['required', 'string', 'max:1500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'badge_title.required' => 'Judul badge about wajib diisi.',
            'card_1_title.required' => 'Judul kartu 1 wajib diisi.',
            'card_1_text.required' => 'Deskripsi konten kartu 1 wajib diisi.',
            'card_2_title.required' => 'Judul kartu 2 wajib diisi.',
            'card_2_text.required' => 'Deskripsi konten kartu 2 wajib diisi.',
        ];
    }
}
