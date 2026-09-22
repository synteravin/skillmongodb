<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class RespondQuestExtensionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'request_id' => ['required', 'string'],
            'accept' => ['required', 'boolean'],
            'response_note' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'request_id.required' => 'ID permohonan wajib disertakan.',
            'accept.required' => 'Pilihan persetujuan wajib ditentukan.',
        ];
    }
}
