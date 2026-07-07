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
        ];
    }

    public function messages(): array
    {
        return [
            'max_salary.gte' => 'Gaji maksimal harus lebih besar atau sama dengan gaji minimal.',
            'deadline.after_or_equal' => 'Tenggat waktu harus hari ini atau hari esok.',
        ];
    }
}
