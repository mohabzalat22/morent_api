<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
// models
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DetailController;

Route::middleware(['auth:sanctum'])->group(
    function(){
        Route::get('/user', function(Request $request){
            return $request->user();
        });
        // payment controller
    }
);

//AUTH
require __DIR__ . '/auth.php';

Route::prefix('v1')->group(function(){
    // HOME
    Route::post('/', [HomeController::class, 'index']);

    // CATEGORY
    // Route::get('/category', [CategoryController::class, 'index']);
    
    // CATEGORY DATA MODEL AND CAPACITY FILTER
    // Route::get('/category/data', [CategoryController::class, 'data']);
    
    // CATEGORY CARS FILTER POST
    // Route::post('/category/filter', [CategoryController::class, 'filter']);
    
    // DETAIL
    // Route::get('/detail/{id}', [DetailController::class, 'show']);
    
    // DETAIL CARS FILTER POST
    // Route::post('/detail/filter', [DetailController::class, 'filter']);
});