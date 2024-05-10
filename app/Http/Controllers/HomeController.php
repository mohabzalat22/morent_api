<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //popular cars
    public function index(Request $request){
        $pick =  $request->pick;
        $drop = $request->drop;
        if($pick->count() != 0 && $drop->count() == 0)
        {
            return Car::where();
        }
    }
}
