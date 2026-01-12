<?php

/**
 * API Routes
 *
 * All routes are prefixed with /api and use the api middleware.
 */

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\CarController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;

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
     * Profile Routes
     * GET    /api/profile - Show profile
     * PUT    /api/profile - Update profile
     * DELETE /api/profile - Delete profile
     */
    Route::apiResource('profile', ProfileController::class)->only(['show', 'update', 'destroy']);

    /**
     * Reservation Routes
     * GET    /api/reservations           - List user reservations
     * POST   /api/reservations           - Create reservation
     * GET    /api/reservations/{id}      - Show reservation
     * PUT    /api/reservations/{id}      - Update reservation
     * DELETE /api/reservations/{id}      - Delete reservation
     */
    Route::apiResource('reservations', ReservationController::class);

    /**
     * Review Routes (nested under cars)
     * GET  /api/cars/{car}/reviews - List reviews for a car
     * POST /api/cars/{car}/reviews - Create review for a car
     */
    Route::apiResource('cars.reviews', ReviewController::class)->only(['index', 'store']);

    /**
     * Review Routes (standalone)
     * GET    /api/reviews/{id} - Show review
     * PUT    /api/reviews/{id} - Update review
     * DELETE /api/reviews/{id} - Delete review
     */
    Route::apiResource('reviews', ReviewController::class)->only(['show', 'update', 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Public API v1 Routes
|--------------------------------------------------------------------------
|
| Public routes that don't require authentication.
|
*/
Route::prefix('v1')->group(function () {
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
