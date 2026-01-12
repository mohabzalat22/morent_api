<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $review = $this->route('review');

        return $review->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'review' => ['sometimes', 'string', 'min:1'],
            'stars' => ['sometimes', 'integer', 'min:1', 'max:5'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'review.min' => 'Review must be provided.',
            'stars.min' => 'Rating must be at least 1 star.',
            'stars.max' => 'Rating cannot exceed 5 stars.',
        ];
    }
}
