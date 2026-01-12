<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
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

        Response::macro('error', function (string $message = 'Error', int $code = 200, $errors = null) {
            return response()->json(
                [
                    'success' => true,
                    'message' => $message,
                    'errors' => $errors
                ],
                $code
            );
        });
    }
}
