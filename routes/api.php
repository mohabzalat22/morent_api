<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DetailController;

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
Route::post('/detail/filter', [DetailController::class, 'filter']);