<?php

namespace App\Http\Requests\Module;

use App\Models\Module;
use Illuminate\Foundation\Http\FormRequest;

class UpdateModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage', Module::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'contents' => 'nullable|array',
        ];
    }
}
