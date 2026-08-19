<?php

namespace App\Http\Requests\Quest;

use App\Models\Quest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RejectQuestWorkRequest extends FormRequest
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
            'revision_note' => ['required', 'string', 'max:2000'],
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
            'revision_note' => 'Catatan revisi',
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
            'revision_note.required' => 'Catatan revisi yang harus diperbaiki pekerja wajib diisi.',
            'revision_note.max' => 'Catatan revisi maksimal 2000 karakter.',
        ];
    }
}
