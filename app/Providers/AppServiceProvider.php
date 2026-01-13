<?php

namespace App\Providers;

use App\Models\Reservation;
use App\Models\Review;
use App\Policies\ReservationPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register authorization policies
        Gate::policy(Reservation::class, ReservationPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        Response::macro('success', function ($data = null, string $message = 'Success', int $code = 200) {
            return response()->json(
                [
                    'success' => true,
                    'message' => $message,
                    'data' => $data
                ],
                $code
            );
        });

        Response::macro('error', function (string $message = 'Error', int $code = 400, $errors = null) {
            return response()->json(
                [
                    'success' => false,
                    'message' => $message,
                    'errors' => $errors
                ],
                $code
            );
        });
    }
}
