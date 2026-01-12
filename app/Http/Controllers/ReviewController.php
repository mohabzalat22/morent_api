<?php

namespace App\Http\Controllers;

use App\Http\Requests\DestroyReviewRequest;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Car;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific car.
     *
     * @param Car 
     * @return JsonResponse 
     */
    public function index(Car $car): JsonResponse
    {
        $reviews = $car->reviews()->with('user')->get();

        return response()->success($reviews, 'Reviews retrieved successfully.');
    }

    /**
     * Get a specific review.
     *
     * @param Review 
     * @return JsonResponse 
     */
    public function show(Review $review): JsonResponse
    {
        $data = $review->load(['car', 'user']);

        return response()->success($data, 'Review retrieved successfully.');
    }

    /**
     * Store a new review for a car.
     *
     * @param StoreReviewRequest
     * @param Car 
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(StoreReviewRequest $request, Car $car): JsonResponse
    {
        $review = $car->reviews()->create([
            'user_id' => $request->user()->id,
            'review' => $request->review,
            'stars' => $request->stars,
        ]);
        $data = $review->load('user');

        return response()->success($data, 'Review created successfully.', 201);
    }

    /**
     * Update an existing review.
     *
     * @param UpdateReviewRequest 
     * @param Review 
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(UpdateReviewRequest $request, Review $review): JsonResponse
    {
        $review->update($request->validated());
        $data = $review->load('user');

        return response()->success($data, 'Review updated successfully.');
    }

    /**
     * Delete a review.
     *
     * @param DestroyReviewRequest 
     * @param Review 
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function destroy(DestroyReviewRequest $request, Review $review): JsonResponse
    {
        $review->delete();

        return response()->success(null, 'Review deleted successfully.');
    }
}
