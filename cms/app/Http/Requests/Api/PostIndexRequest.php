<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lang'     => ['required', 'string', Rule::exists('languages', 'code')->where('is_active', true)],
            'type'     => ['nullable', 'string', 'max:32'],
            'category' => ['nullable', 'string', 'max:160'],
            'tag'      => ['nullable', 'string', 'max:160'],
            'author'   => ['nullable', 'string', 'max:160'],
            'q'        => ['nullable', 'string', 'max:120'],
            'page'     => ['nullable', 'integer', 'min:1', 'max:10000'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'lang.required' => 'The lang query parameter is required.',
            'lang.exists'   => 'The supplied lang is not an active language.',
        ];
    }
}
