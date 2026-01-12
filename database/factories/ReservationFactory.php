<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('now', '+30 days');
        $endTime = fake()->dateTimeBetween($startTime, $startTime->format('Y-m-d H:i:s') . ' +14 days');

        return [
            'car_id' => Car::factory(),
            'user_id' => User::factory(),
            'pick_location' => strtolower(fake()->city()),
            'drop_location' => strtolower(fake()->city()),
            'start_time' => $startTime,
            'end_time' => $endTime,
        ];
    }
}
