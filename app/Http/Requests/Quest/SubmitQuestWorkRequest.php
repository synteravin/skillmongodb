<?php

namespace App\Http\Requests\Quest;

use App\Models\Quest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SubmitQuestWorkRequest extends FormRequest
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

        return (string) $quest->worker_id === (string) $this->user()?->_id || ($this->user()?->isAdmin() ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'submission_link' => ['required', 'url', 'max:255'],
            'submission_note' => ['nullable', 'string', 'max:2000'],
            'submission_file' => ['nullable', 'file', 'mimes:zip,rar,7z,pdf,png,jpg,jpeg', 'max:51200'],
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
            'submission_link' => 'Tautan hasil pekerjaan',
            'submission_note' => 'Catatan hasil pekerjaan',
            'submission_file' => 'Berkas lampiran pekerjaan',
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
            'submission_link.required' => 'Tautan demo / repositori hasil pekerjaan wajib diisi.',
            'submission_link.url' => 'Format tautan hasil pekerjaan tidak valid (harus berupa URL lengkap, contoh: https://...).',
            'submission_file.file' => 'Berkas pengiriman harus berupa file valid.',
            'submission_file.mimes' => 'Format berkas pengiriman harus berupa ZIP, RAR, 7Z, PDF, PNG, atau JPG.',
            'submission_file.max' => 'Ukuran berkas pengiriman maksimal adalah 50MB.',
            'submission_note.max' => 'Catatan pengiriman maksimal 2000 karakter.',
        ];
    }
}
