<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Car;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific car.
     *
     * @param int $car_id 
     * @return JsonResponse 
     * @throws ModelNotFoundException | \Throwable
     */
    public function index(int $car_id): JsonResponse
    {
        try {
            $car = Car::where('id', $car_id)->firstOrFail();
            $reviews = $car->reviews()->with('user')->get();
            return response()->success($reviews, 'Reviews retrieved successfully.');
        } catch (ModelNotFoundException $e) {
            return response()->error("Can not find Car with id: $car_id", 404);
        } catch (\Throwable $e) {
            return response()->error("Can not retrieve Car reviews", 404);
        }
    }

    /**
     * Get a specific review.
     *
     * @param int car_id
     * @param int review_id  
     * @return JsonResponse 
     */
    public function show(int $car_id, int $review_id): JsonResponse
    {
        try {
            $review = Review::where('car_id', $car_id)
                ->where('id', $review_id)
                ->with(['car', 'user'])
                ->firstOrFail();
            return response()->success($review, 'Review retrieved successfully.');
        } catch (ModelNotFoundException $e) {
            return response()->error("Can not find Review with id: $review_id", 404);
        } catch (\Throwable $e) {
            return response()->error('Can not find Review.', 404);
        }
    }

    /**
     * Store a new review for a car.
     *
     * @param StoreReviewRequest
     * @param int car_id 
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException \ \Throwable
     */
    public function store(StoreReviewRequest $request, int $car_id): JsonResponse
    {
        try {
            $car = Car::where('id', $car_id)->firstOrFail();
            $review = $car->reviews()->create([
                'user_id' => $request->user()->id,
                'review' => $request->review,
                'stars' => $request->stars,
            ]);
            $data = $review->load('user');

            return response()->success($data, 'Review created successfully.', 201);
        } catch (\Throwable $e) {
            return response()->error('Can not create Review.', 404);
        }
    }

    /**
     * Update an existing review.
     *
     * @param UpdateReviewRequest 
     * @param int car_id
     * @param int review_id  
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException | Illuminate\Auth\Access\AuthorizationException | \Throwable
     */
    public function update(UpdateReviewRequest $request, int $car_id, int $review_id): JsonResponse
    {
        try {
            $review = Review::where('car_id', $car_id)
                ->where('id', $review_id)
                ->firstOrFail();

            $this->authorize('update', $review);

            $validated = $request->validated();
            $review->update($validated);
            $data = $review->load('user');
            return response()->success($data, 'Review updated successfully.');
        } catch (ModelNotFoundException $e) {
            return response()->error("Can not find Review with id: $review_id", 404);
        } catch (AuthorizationException $e) {
            return response()->error('You are not authorized to update this review.', 403);
        } catch (\Throwable $e) {
            return response()->error('Review not found or update failed.', 404);
        }
    }

    /**
     * Delete a review.
     *
     * @param int car_id
     * @param int review_id 
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException | Illuminate\Auth\Access\AuthorizationException | \Throwable
     */
    public function destroy(int $car_id, int $review_id): JsonResponse
    {
        try {
            $review = Review::where('car_id', $car_id)
                ->where('id', $review_id)
                ->firstOrFail();

            $this->authorize('delete', $review);

            $review->delete();
            return response()->success(null, 'Review deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return response()->error("Can not find Review with id: $review_id", 404);
        } catch (AuthorizationException $e) {
            return response()->error('You are not authorized to delete this review.', 403);
        } catch (\Throwable $e) {
            return response()->error('Review not found or delete failed.', 404);
        }
    }
}
