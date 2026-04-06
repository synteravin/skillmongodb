<?php

namespace App\Http\Requests\Module;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Module;

class StoreModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage', Module::class) ?? false;
    }

    public function rules()
    {
        return [
            'path_id' => 'required|string',
            'title' => 'required|string',
        ];
    }
}