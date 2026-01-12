<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $reservation = $this->route('reservation');

        return $reservation->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'pick_location' => ['sometimes', 'string', 'max:255'],
            'drop_location' => ['sometimes', 'string', 'max:255'],
            'start_time' => ['sometimes', 'date', 'after_or_equal:now'],
            'end_time' => ['sometimes', 'date', 'after:start_time'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'start_time.after_or_equal' => 'Start time must be now or in the future.',
            'end_time.after' => 'End time must be after the start time.',
        ];
    }
}
