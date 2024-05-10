<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'phone_number',
        'address',
        'town_city',
        'card_number',
        'expiration_date',
        'card_holder',
        'cvc',
    ];

    // relations

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
