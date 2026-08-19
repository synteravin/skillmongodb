<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestFlagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:255'],
            'details' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan pelaporan wajib dipilih.',
            'reason.max' => 'Alasan pelaporan maksimal 255 karakter.',
            'details.max' => 'Rincian laporan maksimal 2000 karakter.',
        ];
    }
}
