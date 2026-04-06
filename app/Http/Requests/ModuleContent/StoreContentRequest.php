<?php

namespace App\Http\Requests\ModuleContent;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Module;

class StoreContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage', Module::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:text,image,video,file,youtube',
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'url' => 'nullable|url',
            'file' => 'nullable|file|max:20480',
        ];
    }
}