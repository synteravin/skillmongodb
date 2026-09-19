<?php

namespace App\Http\Requests\Quest;

use App\Models\Quest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadDownPaymentProofRequest extends FormRequest
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
            'dp_proof' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
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
            'dp_proof' => 'Bukti transfer uang muka (DP)',
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
            'dp_proof.required' => 'Berkas bukti transfer uang muka (DP) wajib diunggah.',
            'dp_proof.file' => 'Bukti pembayaran DP harus berupa berkas valid.',
            'dp_proof.image' => 'Bukti pembayaran DP harus berupa gambar.',
            'dp_proof.mimes' => 'Format gambar harus JPEG, PNG, JPG, atau WEBP.',
            'dp_proof.max' => 'Ukuran gambar maksimal adalah 10MB.',
        ];
    }
}
