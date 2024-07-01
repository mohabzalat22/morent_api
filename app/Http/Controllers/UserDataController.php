<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserDataController extends Controller
{
    //
    public function reservations(Request $request){
        $user = $request->user;
        if($user['id'] == Auth::user()->id){
           return User::find(Auth::user()->id)->reservations;
        }
    }

    public function reviews(Request $request){
        $user = $request->user;
        $card_id = $request->car_id;
        if($user['id'] == Auth::user()->id){ // my review crud 
          return Car::find($card_id)->reviews;
        }
        else{
          return Car::find($card_id)->reviews;
        }
    }

    public function makeReview(Request $request){
        $car_id = $request->car_id;
        $user = $request->user;
        $review = $request->review;
        $stars = $request->stars;

        if($user['id'] == Auth::user()->id){
          Review::create([
            'car_id' => $car_id,
            'user_id' => $user['id'],
            'review' => $review,
            'stars' => $stars
          ]);
          return 'saved !';
        }
    }
}
