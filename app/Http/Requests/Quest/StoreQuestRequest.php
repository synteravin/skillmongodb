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
            'min_salary' => ['required', 'integer', 'min:0'],
            'max_salary' => ['required', 'integer', 'gte:min_salary'],
            'deadline' => ['required', 'date', 'after_or_equal:today'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'max:2048'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'mimes:pdf,doc,docx,xls,xlsx,zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'max_salary.gte' => 'Gaji maksimal harus lebih besar atau sama dengan gaji minimal.',
            'deadline.after_or_equal' => 'Tenggat waktu harus hari ini atau hari esok.',
            'images.*.max' => 'Setiap gambar tidak boleh lebih dari 2MB.',
            'images.*.image' => 'Setiap berkas gambar harus berupa format gambar valid.',
            'files.*.mimes' => 'Format file pendukung harus berupa PDF, Word, Excel, atau ZIP.',
            'files.*.max' => 'Ukuran berkas tidak boleh lebih dari 10MB.',
        ];
    }
}
