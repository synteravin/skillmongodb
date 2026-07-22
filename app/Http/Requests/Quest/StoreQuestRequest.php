<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'min_budget' => ['required_without:min_salary', 'nullable', 'integer', 'min:0'],
            'max_budget' => ['required_without:max_salary', 'nullable', 'integer', 'gte:min_budget'],
            'min_salary' => ['nullable', 'integer', 'min:0'],
            'max_salary' => ['nullable', 'integer'],
            'deadline' => ['required', 'date', 'after:now'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'max:2048'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'mimes:pdf,doc,docx,xls,xlsx,zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'max_budget.gte' => 'Anggaran maksimal harus lebih besar atau sama dengan anggaran minimal.',
            'deadline.after' => 'Tenggat waktu harus berupa tanggal dan waktu di masa depan.',
            'images.*.max' => 'Setiap gambar tidak boleh lebih dari 2MB.',
            'images.*.image' => 'Setiap berkas gambar harus berupa format gambar valid.',
            'files.*.mimes' => 'Format file pendukung harus berupa PDF, Word, Excel, atau ZIP.',
            'files.*.max' => 'Ukuran berkas tidak boleh lebih dari 10MB.',
        ];
    }
}
