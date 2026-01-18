<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $reservationsPage = (int) $request->query('reservations_page', 1);
        $reviewsPage = (int) $request->query('reviews_page', 1);
        $limit = (int) $request->query('limit', 10);

        $auth_user = auth()->user();
        try {
            $user = User::where('id', $auth_user->id)->firstOrFail();

            // Paginate reservations
            $reservations = $user->reservations()->orderByDesc('created_at')->paginate($limit, ['*'], 'reservations_page', $reservationsPage);

            // Paginate reviews
            $reviews = $user->reviews()->orderByDesc('created_at')->paginate($limit, ['*'], 'reviews_page', $reviewsPage);

            // Prepare user data without relations
            $userData = $user->toArray();
            $userData['reservations'] = $reservations;
            $userData['reviews'] = $reviews;
        } catch (ModelNotFoundException $e) {
            return response()->error(null, 'User profile not found for user with id: ' . ($auth_user->id ?? 'unknown'), 404);
        } catch (\Throwable $e) {
            return response()->error('Failed to retrieve profile due to an unexpected error.', 500);
        }

        return response()->success($userData, 'Profile retrieved successfully.');
    }

    /**
     * Update the user's profile information.
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($user->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->image);
            }

            // Store new image
            $path = $request->file('image')->store('profile_images', 'public');
            $validated['image'] = $path;
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->success($user, 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Revoke all tokens for API authentication
        $user->tokens()->delete();

        $user->delete();

        return response()->success(null, 'Account deleted successfully.');
    }
}
