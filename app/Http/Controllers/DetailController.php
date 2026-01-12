<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterCarRequest;
use App\Models\Car;
use Illuminate\Http\JsonResponse;

class DetailController extends Controller
{

    /**
     * Filter cars based on type, capacity, and price criteria.
     *
     * Filters are applied conditionally - only when the corresponding
     * parameter is provided in the request. Type filtering is case-insensitive.
     *
     * @param FilterCarRequest $request The validated request containing optional filter parameters:
     *                                  - type: array of car types (e.g., ['suv', 'sedan'])
     *                                  - capacity: array of seat capacities
     *                                  - price: maximum daily price
     * @return JsonResponse A JSON response containing the filtered collection of cars
     */
    public function index(FilterCarRequest $request): JsonResponse
    {
        $cars = Car::query()
            ->when($request->validated('type'), fn($query, $type) => $query->whereRaw('LOWER(type) IN (' . implode(',', array_fill(0, count($type), '?')) . ')', array_map('strtolower', $type)))
            ->when($request->validated('capacity'), fn($query, $capacity) => $query->whereIn('capacity', $capacity))
            ->when($request->validated('price'), fn($query, $price) => $query->where('dailyPrice', '<=', $price))
            ->get();

        return response()->json($cars);
    }

    /**
     * Get car information by id
     * @param mixed $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $data = Car::find($id) ?? [];
        return response()->success($data);
    }
}
