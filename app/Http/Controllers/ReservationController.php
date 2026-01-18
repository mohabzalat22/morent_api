<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use App\Models\User;
use Throwable;

class ReservationController extends Controller
{
    /**
     * Get authenticated user's reservations.
     *
     * @param Request 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $auth_user = auth()->user();
            $user = User::findOrFail($auth_user->id);
            $reservations = $user->reservations()->with('car')->get();

            return response()->success($reservations, 'Reservations retrieved successfully.');
        } catch (Throwable $e) {
            return response()->error('Failed to retrieve reservations.', 500, [$e->getMessage()]);
        }
    }

    /**
     * Get a specific reservation.
     *
     * @param Request 
     * @param int $id 
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $reservation = Reservation::with('car')->findOrFail($id);

            $this->authorize('view', $reservation);

            return response()->success($reservation, 'Reservation retrieved successfully.');
        } catch (AuthorizationException $e) {
            return response()->error('You are not authorized to view this reservation.', 403);
        } catch (Throwable $e) {
            return response()->error("Failed to Retrieve reservation with id: $id", 404, [$e->getMessage()]);
        }
    }

    /**
     * Store a new reservation.
     *
     * @param StoreReservationRequest
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $reservation = $request->user()->reservations()->create($request->validated());
        $data = $reservation->load('car');

        return response()->success($data, 'Reservation created successfully.', 201);
    }

    /**
     * Update an existing reservation.
     *
     * @param UpdateReservationRequest
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException | \Throwable
     */
    public function update(UpdateReservationRequest $request, int $id): JsonResponse
    {
        try {
            $reservation = Reservation::findOrFail($id);

            $this->authorize('update', $reservation);

            $reservation->update($request->validated());
            $data = $reservation->refresh()->load('car');
            return response()->success($data, 'Reservation updated successfully.');
        } catch (AuthorizationException $e) {
            return response()->error('You are not authorized to update this reservation.', 403);
        } catch (Throwable $e) {
            return response()->error('Can not Update unResolved Reservation', 404);
        }
    }

    /**
     * Delete a reservation.
     *
     * @param int $id
     * @return JsonResponse
     * @throws Throwable
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $reservation = Reservation::findOrFail($id);

            $this->authorize('delete', $reservation);

            $reservation->delete();
            return response()->success(null, 'Reservation deleted successfully.');
        } catch (AuthorizationException $e) {
            return response()->error('You are not authorized to delete this reservation.', 403);
        } catch (Throwable $e) {
            return response()->error('Can not delete un Resolved Reservation.', 404);
        }
    }
}
