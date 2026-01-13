<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReservationRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'car_id' => ['required', 'exists:cars,id'],
            'user_id' => ['prohibited'],
            'pick_location' => ['required', 'string', 'max:255'],
            'drop_location' => ['required', 'string', 'max:255'],
            'start_time' => ['required', 'date', 'after_or_equal:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'car_id.required' => 'Please select a car.',
            'car_id.exists' => 'The selected car does not exist.',
            'user_id.prohibited' => 'You cannot specify a user ID.',
            'pick_location.required' => 'Please provide a pick-up location.',
            'drop_location.required' => 'Please provide a drop-off location.',
            'start_time.required' => 'Please provide a start time.',
            'start_time.after_or_equal' => 'Start time must be now or in the future.',
            'end_time.required' => 'Please provide an end time.',
            'end_time.after' => 'End time must be after the start time.',
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
