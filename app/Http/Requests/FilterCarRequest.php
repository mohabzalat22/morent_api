<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['nullable', 'array'],
            'type.*' => ['string', 'in:sport,suv,mpv,sedan,coupe,hatchback'],
            'capacity' => ['nullable', 'array'],
            'capacity.*' => ['integer', 'min:1'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
