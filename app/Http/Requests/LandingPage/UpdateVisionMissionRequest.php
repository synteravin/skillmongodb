<?php

namespace App\Http\Requests\LandingPage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisionMissionRequest extends FormRequest
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
            'pillars' => ['required', 'array', 'min:1'],
            'pillars.*.id' => ['required', 'string'],
            'pillars.*.badge' => ['required', 'string', 'max:50'],
            'pillars.*.title' => ['required', 'string', 'max:100'],
            'pillars.*.description' => ['required', 'string', 'max:500'],
            'pillars.*.icon' => ['nullable', 'string', 'max:255'],
            'pillars.*.badge_color' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pillars.required' => 'Data pilar visi dan misi wajib disertakan.',
            'pillars.*.badge.required' => 'Label badge pilar wajib diisi.',
            'pillars.*.description.required' => 'Deskripsi pilar visi dan misi wajib diisi.',
            'pillars.*.description.max' => 'Deskripsi maksimal 500 karakter.',
        ];
    }
}
