<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'model',
        'image',
        'background',
        'tank',
        'type',
        'capacity',
        'dailyPrice',
        'description'
    ];

    //relations

    public function reviews() : HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function reservations() : HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
