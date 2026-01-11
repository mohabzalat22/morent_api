<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['Credit Card', 'Debit Card', 'PayPal', 'Bitcoin']),
            'phone_number' => fake()->phoneNumber(),
            'address' => fake()->streetAddress(),
            'town_city' => fake()->city(),
            'card_number' => fake()->creditCardNumber(),
            'expiration_date' => fake()->dateTimeBetween('now', '+5 years'),
            'card_holder' => fake()->name(),
            'cvc' => fake()->numberBetween(100, 999),
        ];
    }
}
