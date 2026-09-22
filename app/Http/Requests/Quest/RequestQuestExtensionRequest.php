<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class RequestQuestExtensionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'proposed_deadline' => ['required', 'date', 'after:now'],
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'proposed_deadline.required' => 'Tenggat waktu baru yang diusulkan wajib diisi.',
            'proposed_deadline.after' => 'Tenggat waktu baru harus di masa mendatang.',
            'reason.required' => 'Alasan permohonan perpanjangan waktu wajib diisi.',
            'reason.max' => 'Alasan maksimal 1000 karakter.',
        ];
    }
}
