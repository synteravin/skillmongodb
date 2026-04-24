<?php

namespace App\Http\Requests\Path;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Path;

class SelectPathRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isStudent();
    }

    public function rules(): array
    {
        return [];
    }
}