<?php

namespace App\Http\Requests\Quest;

use App\Models\Quest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ExtendQuestDeadlineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $quest = $this->route('quest');
        if (is_string($quest)) {
            $quest = Quest::where('_id', $quest)->orWhere('slug', $quest)->first();
        }
        if (! $quest) {
            return true;
        }

        return (string) $quest->creator_id === (string) $this->user()?->_id || ($this->user()?->isAdmin() ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'deadline' => ['required', 'date', 'after:now'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'deadline' => 'Tenggat waktu baru',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'deadline.required' => 'Tanggal tenggat waktu baru wajib ditentukan.',
            'deadline.date' => 'Format tanggal tidak valid.',
            'deadline.after' => 'Tenggat waktu baru harus berupa waktu yang akan datang.',
        ];
    }
}
