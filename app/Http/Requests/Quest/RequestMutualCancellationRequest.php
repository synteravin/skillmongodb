<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class RequestMutualCancellationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:1500'],
            'dp_handling' => ['required', 'string', 'in:refund_creator,keep_worker,split'],
            'split_percentage' => ['nullable', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan permohonan pembatalan wajib diisi.',
            'dp_handling.required' => 'Pilihan perlakuan uang muka wajib ditentukan.',
            'dp_handling.in' => 'Pilihan perlakuan uang muka tidak valid.',
        ];
    }
}
