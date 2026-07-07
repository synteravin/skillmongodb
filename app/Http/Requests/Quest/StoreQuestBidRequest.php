<?php

namespace App\Http\Requests\Quest;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestBidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isStudent();
    }

    public function rules(): array
    {
        $quest = $this->route('quest');
        $min = $quest ? $quest->min_salary : 0;
        $max = $quest ? $quest->max_salary : PHP_INT_MAX;

        return [
            'bid_amount' => ['required', 'integer', "min:{$min}", "max:{$max}"],
            'cv' => ['required', 'string'],
            'portfolio' => ['required', 'string'],
            'proposal' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        $quest = $this->route('quest');
        $min = $quest ? number_format($quest->min_salary) : 'gaji minimal';
        $max = $quest ? number_format($quest->max_salary) : 'gaji maksimal';

        return [
            'bid_amount.min' => "Harga penawaran minimal Rp {$min}.",
            'bid_amount.max' => "Harga penawaran maksimal Rp {$max}.",
        ];
    }
}
