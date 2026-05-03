<?php

namespace App\Http\Requests\Module;

use Illuminate\Foundation\Http\FormRequest;

class CompleteModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isStudent();
    }

    public function rules(): array
    {
        return [
            'module_id' => 'required',
        ];
    }
}
