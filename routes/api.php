<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
// controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;

Route::middleware(['auth:sanctum'])->group(
    function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Profile routes
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::delete('/profile', [ProfileController::class, 'destroy']);

        // Reservations
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

        // Reviews
        Route::get('/cars/{car}/reviews', [ReviewController::class, 'index']);
        Route::post('/cars/{car}/reviews', [ReviewController::class, 'store']);
        Route::get('/reviews/{review}', [ReviewController::class, 'show']);
        Route::put('/reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // payment controller
    }
);

//AUTH
require __DIR__ . '/auth.php';

Route::prefix('v1')->group(function () {
    // HOME
    Route::post('/', [HomeController::class, 'index']);

    // CATEGORY
    Route::get('/category', [CategoryController::class, 'index']);

    // CATEGORY DATA MODEL AND CAPACITY FILTER
    Route::get('/category/data', [CategoryController::class, 'data']);

    // CATEGORY CARS FILTER POST
    Route::post('/category/filter', [CategoryController::class, 'filter']);

    // DETAIL
    Route::get('/detail/{id}', [DetailController::class, 'show']);

    // DETAIL CARS FILTER POST
    Route::post('/detail/filter', [DetailController::class, 'index']);
});
