<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Car;

class DetailController extends Controller
{
    //
    public function show($id){
        return Car::find($id);
    }
    public function filter(Request $request){
        // maybe no validation required here
        return car::whereIn('model', $request->type)->whereIn('capacity', $request->capacity)->where('dailyPrice', '<=', $request->price)->get();
    }
}
