<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Car::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'model' => fake()->numberBetween(2015, 2024),
            'image' => 'http://localhost:8000/images/' . fake()->numberBetween(1, 12) . '.png',
            'background' => '/images/BG.png',
            'tank' => fake()->numberBetween(40, 100),
            'type' => fake()->randomElement(['SUV', 'Sedan', 'Sport', 'Hatchback', 'Coupe', 'MPV']),
            'capacity' => fake()->numberBetween(2, 8),
            'dailyPrice' => fake()->numberBetween(30, 300),
            'description' => fake()->paragraph(3),
        ];
    }
}
