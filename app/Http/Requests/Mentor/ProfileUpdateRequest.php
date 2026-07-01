<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && ($user->isMentor() || $user->isAdmin());
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->input('avatar') === 'null' || $this->input('avatar') === '') {
            $this->merge(['avatar' => null]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userModel = $this->route('user');
        $userId = $userModel
            ? $userModel->_id
            : $this->user()->_id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username,'.$userId.',_id'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$userId.',_id'],
            'profession' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'user_experience' => ['nullable', 'string', 'max:255'],

            // Work Experience Embedded Array
            'work_experiences' => ['nullable', 'array'],
            'work_experiences.*.jabatan' => ['nullable', 'string', 'max:255'],
            'work_experiences.*.perusahaan' => ['nullable', 'string', 'max:255'],
            'work_experiences.*.tahun_mulai' => ['nullable', 'string', 'max:50'],
            'work_experiences.*.tahun_selesai' => ['nullable', 'string', 'max:50'],
            'work_experiences.*.deskripsi' => ['nullable', 'string'],

            // Education Embedded Array
            'educations' => ['nullable', 'array'],
            'educations.*.gelar' => ['nullable', 'string', 'max:255'],
            'educations.*.prodi' => ['nullable', 'string', 'max:255'],
            'educations.*.universitas' => ['nullable', 'string', 'max:255'],
            'educations.*.tahun_mulai' => ['nullable', 'string', 'max:50'],
            'educations.*.tahun_selesai' => ['nullable', 'string', 'max:50'],
            'educations.*.spesialisasi' => ['nullable', 'string'],

            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
