<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterCarRequest;
use App\Http\Requests\FilterCarsRequest;
use App\Http\Requests\GetCategoryRequest;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

/**
 * Controller for managing car resources.
 *
 * Handles car listing, searching, filtering, and retrieval operations.
 */
class CarController extends Controller
{
    /**
     * List cars or search by name prefix.
     *
     * @param GetCategoryRequest $request
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function index(GetCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $carName = $validated['name'] ?? '';
        $records = Car::where('name', 'like', $carName . '%')->get();

        return response()->success($records, 'Cars retrieved successfully.');
    }

    /**
     * Get a specific car by ID.
     *
     * @param Car $car
     * @return JsonResponse
     */
    public function show(Car $car): JsonResponse
    {
        return response()->success($car, 'Car retrieved successfully.');
    }

    /**
     * Get filter metadata (types and capacities with counts).
     *
     * @return JsonResponse
     */
    public function meta(): JsonResponse
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
                fn($type) => [$type => $typeCounts[$type] ?? 0]
            )->values(),
            'capacities' => collect($capacities)->map(
                fn($cap) => [$cap => $capacityCounts[$cap] ?? 0]
            )->values(),
        ];

        return response()->success($data, 'Filter metadata retrieved successfully.');
    }

    /**
     * Simple filter for cars based on type, capacity, and price.
     *
     * Filters are applied conditionally - only when the corresponding
     * parameter is provided. Type filtering is case-insensitive.
     *
     * @param FilterCarRequest $request
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function simpleFilter(FilterCarRequest $request): JsonResponse
    {
        $cars = Car::query()
            ->when(
                $request->validated('type'),
                fn($query, $type) => $query->whereRaw(
                    'LOWER(type) IN (' . implode(',', array_fill(0, count($type), '?')) . ')',
                    array_map('strtolower', $type)
                )
            )
            ->when(
                $request->validated('capacity'),
                fn($query, $capacity) => $query->whereIn('capacity', $capacity)
            )
            ->when(
                $request->validated('price'),
                fn($query, $price) => $query->where('dailyPrice', '<=', $price)
            )
            ->get();

        return response()->success($cars, 'Cars filtered successfully.');
    }

    /**
     * Filter available cars based on pickup/drop-off criteria and optional filters.
     *
     * @param FilterCarsRequest $request
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
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

        return response()->success($cars, 'Cars filtered successfully.');
    }
}
