<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\CarController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;

/**
 * API Routes
 *
 * All routes are prefixed with /api/version and use the api middleware.
 */

Route::prefix('v1.1.0')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth Routes
    |--------------------------------------------------------------------------
    */

    require_once __DIR__ . '/auth.php';

    /*
    |--------------------------------------------------------------------------
    | Authenticated Routes
    |--------------------------------------------------------------------------
    |
    | Routes that require authentication via Sanctum.
    |
    */

    Route::middleware(['auth:sanctum'])->group(function () {
        /**
         * GET /api/user - Get authenticated user
         */
        Route::get('/user', fn(Request $request) => $request->user());

        /**
         * Profile Routes for authenticated user
         * GET    /api/profile - Show profile
         * PUT    /api/profile - Update profile
         * DELETE /api/profile - Delete profile
         */
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::delete('/profile', [ProfileController::class, 'destroy']);

        /**
         * Reservation Routes
         * GET    /api/reservations           - List user reservations
         * POST   /api/reservations           - Create reservation
         * GET    /api/reservations/{id}      - Show reservation
         * PUT    /api/reservations/{id}      - Update reservation
         * DELETE /api/reservations/{id}      - Delete reservation
         * 
         * Authorization: Users can only access/modify their own reservations (ReservationPolicy)
         */
        Route::apiResource('reservations', ReservationController::class)->parameter('reservations', 'id');

        /*
     * Review Routes (nested under cars)
     * GET    /api/cars/{car_id}/reviews             - List reviews for a car
     * POST   /api/cars/{car_id}/reviews             - Create review for a car
     * GET    /api/cars/{car_id}/reviews/{review_id} - Show review
     * PUT    /api/cars/{car_id}/reviews/{review_id} - Update review
     * DELETE /api/cars/{car_id}/reviews/{review_id} - Delete review
     * 
     * Authorization: Users can only update/delete their own reviews (ReviewPolicy)
     */
        Route::apiResource('cars.reviews', ReviewController::class)->parameters([
            'cars' => 'car_id',
            'reviews' => 'review_id'
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | Public API v1 Routes
    |--------------------------------------------------------------------------
    |
    | Public routes that don't require authentication.
    |
    */

    /**
     * POST /api/v1/ - Home page data
     */
    Route::post('/', [HomeController::class, 'index']);

    /**
     * Car Routes
     * GET  /api/v1/cars                - List/search cars
     * GET  /api/v1/cars/meta           - Get filter metadata (types, capacities)
     * POST /api/v1/cars/simple-filter  - Simple filter (type, capacity, price)
     * POST /api/v1/cars/filter         - Filter cars with availability
     * GET  /api/v1/cars/{car}          - Show car details
     */
    Route::get('/cars', [CarController::class, 'index']);
    Route::get('/cars/meta', [CarController::class, 'meta']);
    Route::post('/cars/simple-filter', [CarController::class, 'simpleFilter']);
    Route::post('/cars/filter', [CarController::class, 'filter']);
    Route::get('/cars/{car}', [CarController::class, 'show']);
});
