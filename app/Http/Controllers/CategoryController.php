<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Car;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request){
        $validation = Validator::make($request->all(),[
            'name' => ['string','max:25']
        ]);
        if($validation->fails()){
            return response()->json([
                'message' => 'validation failed',
                'errors' => $validation->errors(),
            ]);
        } 
        return Car::where('name', 'like', $request->name . '%')->get();
        
    } 
    public function data(){
        $types = ['sport','suv','mpv','sedan','coupe','hatchback'];
        $capacities = ['2','4','6','8'];
        $typesCount = [];
        $capacitiesCount = [];
        //DATA
        $DATA = [];
        foreach($types as $t){
            array_push($typesCount, Car::where('model', $t)->count());
        }
        foreach($capacities as $c){
            array_push($capacitiesCount, Car::where('capacity', $c)->count());
        }
        array_push($DATA, $typesCount, $capacitiesCount);
        return $DATA;
    }
    public function filter(Request $request){
        // maybe no validation required here
        return car::whereIn('model', $request->type)->whereIn('capacity', $request->capacity)->where('dailyPrice', '<=', $request->price)->get();
    }
}
