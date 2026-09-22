<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class RespondDisputeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'response_note' => ['required', 'string', 'max:2000'],
            'evidence_files' => ['nullable', 'array', 'max:5'],
            'evidence_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf,zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'response_note.required' => 'Tanggapan sengketa wajib diisi.',
            'response_note.max' => 'Tanggapan maksimal 2000 karakter.',
            'evidence_files.max' => 'Maksimal 5 berkas bukti yang dapat dilampirkan.',
            'evidence_files.*.file' => 'Berkas bukti harus berupa file yang valid.',
            'evidence_files.*.mimes' => 'Format berkas bukti harus berupa JPG, PNG, PDF, atau ZIP.',
            'evidence_files.*.max' => 'Ukuran setiap berkas bukti maksimal 10 MB.',
        ];
    }
}
