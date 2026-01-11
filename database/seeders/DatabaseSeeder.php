<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Create a test user
        $user = User::factory()->create([
            'name' => 'mohab',
            'email' => 'mohab@gmail.com',
            'password' => Hash::make('12345678')
        ]);

        // Create cars
        $cars = Car::factory(20)->create();

        // Create reviews for cars
        $cars->each(function ($car) use ($user) {
            Review::factory(rand(3, 8))->create([
                'car_id' => $car->id,
                'user_id' => $user->id,
            ]);
        });

        // Create reservations
        Reservation::factory(1)->create([
            'car_id' => $cars->random()->id,
            'user_id' => $user->id,
        ]);

        // Create payments for users
        Payment::factory(rand(1, 3))->create([
            'user_id' => $user->id,
        ]);
    }
}
