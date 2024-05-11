<?php
// auth
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
// models
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DetailController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['api'])->group(function(){
    // AUTH
    Route::post('/register', [RegisteredUserController::class, 'store'])
                    ->middleware('guest')
                    ->name('register');
    
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                    ->middleware('guest')
                    ->name('login');
    
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                    ->middleware('guest')
                    ->name('password.email');
    
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
                    ->middleware('guest')
                    ->name('password.store');
    
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                    ->middleware(['auth', 'signed', 'throttle:6,1'])
                    ->name('verification.verify');
    
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                    ->middleware(['auth', 'throttle:6,1'])
                    ->name('verification.send');
    
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
                    ->middleware('auth')
                    ->name('logout');
});


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