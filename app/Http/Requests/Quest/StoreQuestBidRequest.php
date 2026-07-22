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
        $min = $quest ? ($quest->min_budget ?? $quest->min_salary ?? 0) : 0;
        $max = $quest ? ($quest->max_budget ?? $quest->max_salary ?? PHP_INT_MAX) : PHP_INT_MAX;

        return [
            'bid_amount' => ['required', 'integer', "min:{$min}", "max:{$max}"],
            'cv' => ['nullable', 'string'],
            'cv_file' => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'],
            'portfolio' => ['nullable', 'string'],
            'portfolio_file' => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png,zip,rar', 'max:10240'],
            'proposal' => ['required', 'string'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (empty($this->cv) && ! $this->hasFile('cv_file') && ! $this->hasFile('cv')) {
                $validator->errors()->add('cv', 'Silakan masukkan tautan CV atau unggah berkas CV Anda.');
            }
            if (empty($this->portfolio) && ! $this->hasFile('portfolio_file') && ! $this->hasFile('portfolio')) {
                $validator->errors()->add('portfolio', 'Silakan masukkan tautan portofolio atau unggah berkas portofolio Anda.');
            }
        });
    }

    public function messages(): array
    {
        $quest = $this->route('quest');
        $min = $quest ? number_format($quest->min_budget ?? $quest->min_salary ?? 0) : 'anggaran minimal';
        $max = $quest ? number_format($quest->max_budget ?? $quest->max_salary ?? 0) : 'anggaran maksimal';

        return [
            'bid_amount.min' => "Harga penawaran minimal Rp {$min}.",
            'bid_amount.max' => "Harga penawaran maksimal Rp {$max}.",
            'cv_file.mimes' => 'Berkas CV harus format PDF, DOC, DOCX, JPG, atau PNG.',
            'cv_file.max' => 'Ukuran berkas CV maksimal 5 MB.',
            'portfolio_file.mimes' => 'Berkas portofolio harus format PDF, DOC, DOCX, JPG, PNG, ZIP, atau RAR.',
            'portfolio_file.max' => 'Ukuran berkas portofolio maksimal 10 MB.',
        ];
    }
}
