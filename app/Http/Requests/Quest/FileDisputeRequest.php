<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class FileDisputeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan pengajuan banding wajib diisi.',
            'reason.max' => 'Alasan pengajuan banding maksimal 1000 karakter.',
        ];
    }
}
