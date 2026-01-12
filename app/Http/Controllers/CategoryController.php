<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterCarsRequest;
use App\Http\Requests\GetCategoryRequest;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get cars by name prefix.
     *
     * Searches for cars whose name starts with the given string.
     *
     * @param GetCategoryRequest $request The validated request containing the search name
     *
     * @return JsonResponse JSON response containing:
     *                  - On success: Array of Car models matching the name prefix
     *                  - Message: 'Fetched Cars Successfully.'
     *
     * @example Request:
     * GET /api/categories?name=toyota
     *
     * @example Response:
     * {
     *     "success": true,
     *     "data": [
     *         { "id": 1, "name": "Toyota Camry", "type": "sedan", ... },
     *         { "id": 2, "name": "Toyota Corolla", "type": "sedan", ... }
     *     ],
     *     "message": "Fetched Cars Successfully."
     * }
     *
     * @throws \Illuminate\Validation\ValidationException When request validation fails
     *
     * @see \App\Models\Car
     * @see \App\Http\Requests\GetCategoryRequest
     */
    public function index(GetCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $carName = isset($validated['name']) ?? '';
        $records = Car::where('name', 'like', $carName . '%')->get();
        return response()->success($records, 'Fetched Cars Successfully.');
    }
    /**
     * Get sidebar data for cars categories like (types, capacity)
     * @return JsonResponse
     */
    public function data(): JsonResponse
    {
        $types = ['sport', 'suv', 'mpv', 'sedan', 'coupe', 'hatchback'];
        $capacities = ['2', '4', '6', '8'];

        $typeCounts = Car::selectRaw('LOWER(type) as type, COUNT(*) as count')
            ->whereRaw(
                'LOWER(type) IN (' . implode(',', array_fill(0, count($types), '?')) . ')',
                $types
            )
            ->groupByRaw('LOWER(type)')
            ->pluck('count', 'type');

        $capacityCounts = Car::selectRaw('capacity, COUNT(*) as count')
            ->whereIn('capacity', $capacities)
            ->groupBy('capacity')
            ->pluck('count', 'capacity');

        $data = [
            'types' => collect($types)->map(
                fn($type) => [$type => $typeCounts[$type]] ?? [$type => 0]
            )->values(),

            'capacities' => collect($capacities)->map(
                fn($cap) => [$cap => $capacityCounts[$cap]] ?? [$cap => 0]
            )->values(),
        ];

        return response()->success($data, 'Retrived sidebar data Successfully');
    }

    /**
     * Filter available cars based on pickup/drop-off criteria and optional filters.
     *
     * This endpoint allows users to search for available cars by specifying:
     * - Pickup and/or drop-off location and datetime
     * - Vehicle type preferences (e.g., SUV, sedan)
     * - Seating capacity requirements
     * - Maximum daily price
     *
     * The availability check ensures no overlapping reservations exist for the requested period.
     *
     * @param FilterCarsRequest $request The validated request containing filter parameters
     *
     * @return JsonResponse JSON response containing:
     *                  - On success: Array of available Car models matching the criteria
     *                  - Message: 'Retrieved cars after applying filters successfully.'
     *
     * @example Request body pick|drop is required:
     * {
     *     "data": {
     *         "pick": { "location": "cairo", "datetime": "2026-01-15 10:00" }, 
     *         "drop": { "location": "cairo", "datetime": "2026-01-20 10:00" }
     *     },
     *     "type": ["suv", "sedan"], //optional
     *     "capacity": [4, 6], //optional
     *     "price": 100 //optional
     * }
     *
     * @throws \Illuminate\Validation\ValidationException When request validation fails
     *
     * @see \App\Models\Car
     * @see \App\Models\Reservation
     * @see \App\Http\Requests\FilterCarsRequest
     */
    public function filter(FilterCarsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $data = $validated['data'] ?? [];

        $pick = $data['pick'] ?? null;
        $drop = $data['drop'] ?? null;

        $query = Car::query();

        // Apply reservation availability filter
        if ($pick && $drop) {
            $pickDateTime = Carbon::parse($pick['datetime']);
            $dropDateTime = Carbon::parse($drop['datetime']);
            $pickLocation = strtolower($pick['location']);
            $dropLocation = strtolower($drop['location']);

            $query->whereDoesntHave('reservations', function ($q) use ($pickDateTime, $dropDateTime, $pickLocation, $dropLocation) {
                $q->where('start_time', '<', $dropDateTime)
                    ->where('end_time', '>', $pickDateTime)
                    ->where('pick_location', $pickLocation)
                    ->where('drop_location', $dropLocation);
            });
        } elseif ($pick) {
            $pickDateTime = Carbon::parse($pick['datetime']);
            $pickLocation = strtolower($pick['location']);

            $query->whereDoesntHave('reservations', function ($q) use ($pickDateTime, $pickLocation) {
                $q->where('start_time', '<=', $pickDateTime)
                    ->where('end_time', '>=', $pickDateTime)
                    ->where('pick_location', $pickLocation);
            });
        } elseif ($drop) {
            $dropDateTime = Carbon::parse($drop['datetime']);
            $dropLocation = strtolower($drop['location']);

            $query->whereDoesntHave('reservations', function ($q) use ($dropDateTime, $dropLocation) {
                $q->where('start_time', '<=', $dropDateTime)
                    ->where('end_time', '>=', $dropDateTime)
                    ->where('drop_location', $dropLocation);
            });
        }

        // Apply optional type filter
        if (!empty($validated['type'])) {
            $query->whereIn('type', $validated['type']);
        }

        // Apply optional capacity filter
        if (!empty($validated['capacity'])) {
            $query->whereIn('capacity', $validated['capacity']);
        }

        // Apply optional price filter
        if (!empty($validated['price'])) {
            $query->where('dailyPrice', '<=', $validated['price']);
        }

        $cars = $query->get();

        return response()->success($cars, 'Retrieved cars after applying filters successfully.');
    }
}
