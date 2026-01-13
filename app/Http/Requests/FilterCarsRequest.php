<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class FilterCarsRequest extends FormRequest
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
     * Expected input (pick and/or drop, at least one required):
     * {
     *     "data": {
     *         "pick": { "location": "city,town", "datetime": "2026-01-15 10:00" },  // optional
     *         "drop": { "location": "city,town", "datetime": "2026-01-20 10:00" }   // optional
     *     },
     *     "type": ["suv", "sedan"],      // optional
     *     "capacity": [4, 6],            // optional
     *     "price": 100                   // optional
     * }
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Data object containing pick/drop info (at least one required)
            'data' => ['required', 'array'],
            'data.pick' => ['required_without:data.drop', 'nullable', 'array'],
            'data.pick.location' => ['required_with:data.pick', 'string'],
            'data.pick.datetime' => ['required_with:data.pick', 'date'],
            'data.drop' => ['required_without:data.pick', 'nullable', 'array'],
            'data.drop.location' => ['required_with:data.drop', 'string'],
            'data.drop.datetime' => ['required_with:data.drop', 'date'],

            // Car filters (all optional)
            'type' => ['nullable', 'array'],
            'type.*' => ['string', 'in:sport,suv,mpv,sedan,coupe,hatchback'],
            'capacity' => ['nullable', 'array'],
            'capacity.*' => ['integer', 'in:2,4,6,8'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->error('Validation failed', 422, $validator->errors())
        );
    }
}
