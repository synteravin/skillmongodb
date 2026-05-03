<?php

namespace App\Http\Requests\Module;

use App\Models\Module;
use Illuminate\Foundation\Http\FormRequest;

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
