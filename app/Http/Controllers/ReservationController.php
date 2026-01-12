<?php

namespace App\Http\Controllers;

use App\Http\Requests\DestroyReservationRequest;
use App\Http\Requests\ShowReservationRequest;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Get authenticated user's reservations.
     *
     * @param Request 
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $reservations = $request->user()->reservations()->with('car')->get();

        return response()->success($reservations, 'Reservations retrieved successfully.');
    }

    /**
     * Get a specific reservation.
     *
     * @param ShowReservationRequest 
     * @param Reservation 
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function show(ShowReservationRequest $request, Reservation $reservation): JsonResponse
    {
        $data = $reservation->load('car');

        return response()->success($data, 'Reservation retrieved successfully.');
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
     * @param Reservation
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation): JsonResponse
    {
        $reservation->update($request->validated());
        $data = $reservation->load('car');

        return response()->success($data, 'Reservation updated successfully.');
    }

    /**
     * Delete a reservation.
     *
     * @param DestroyReservationRequest
     * @param Reservation
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function destroy(DestroyReservationRequest $request, Reservation $reservation): JsonResponse
    {
        $reservation->delete();

        return response()->success(null, 'Reservation deleted successfully.');
    }
}
