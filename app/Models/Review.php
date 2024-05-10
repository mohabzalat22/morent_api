<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;
    protected $fillable = [
        'car_id',
        'user_id',
        'review',
        'stars',
    ];

    //relations 
    public function car() : BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
