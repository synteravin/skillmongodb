<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class ResolveArbitrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ruling' => ['required', 'string', 'in:refund,pay_worker,split'],
            'note' => ['required', 'string', 'max:1000'],
            'split_percentage' => ['required_if:ruling,split', 'nullable', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'ruling.required' => 'Keputusan arbitrase wajib dipilih.',
            'ruling.in' => 'Keputusan arbitrase tidak valid.',
            'split_percentage.required_if' => 'Persentase pembagian wajib diisi jika memilih split.',
            'split_percentage.min' => 'Persentase minimal adalah 1%.',
            'split_percentage.max' => 'Persentase maksimal adalah 99%.',
        ];
    }
}
