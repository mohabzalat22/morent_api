<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'user_id' => ['prohibited'],
            'car_id' => ['prohibited'],
            'review' => ['required', 'string'],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.prohibited' => 'You cannot specify a user ID.',
            'car_id.prohibited' => 'Car ID is determined by the URL.',
            'review.required' => 'Please provide a review.',
            'stars.required' => 'Please provide a star rating.',
            'stars.min' => 'Rating must be at least 1 star.',
            'stars.max' => 'Rating cannot exceed 5 stars.',
        ];
    }
}
