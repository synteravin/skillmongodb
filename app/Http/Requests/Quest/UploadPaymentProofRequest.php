<?php

namespace App\Http\Requests\Quest;

use App\Models\Quest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadPaymentProofRequest extends FormRequest
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
            'payment_proof' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
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
            'payment_proof' => 'Bukti transfer pembayaran',
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
            'payment_proof.required' => 'Berkas bukti transfer pembayaran wajib diunggah.',
            'payment_proof.file' => 'Bukti pembayaran harus berupa berkas valid.',
            'payment_proof.image' => 'Bukti pembayaran harus berupa gambar.',
            'payment_proof.mimes' => 'Format gambar harus JPEG, PNG, JPG, atau WEBP.',
            'payment_proof.max' => 'Ukuran gambar maksimal adalah 10MB.',
        ];
    }
}
