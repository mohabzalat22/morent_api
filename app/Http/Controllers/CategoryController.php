<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Car;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
        $req_length = count($request->data);
        if($req_length > 0)
        {
            if($req_length == 1) {
                // pick or drop
                //pick
                if(array_key_exists('pick', $request->data[0])){ 
                    // start time filter not between database start , end 
                    $pick_location = strtolower($request->data[0]['pick']['location']);

                    $pick_date_time = carbon::parse($request->data[0]['pick']['date'] . $request->data[0]['pick']['time']);
                    $cars_after_filter = Car::whereHas(
                        'reservations',
                        function ($query) use ($pick_date_time, $pick_location) {
                            $query->where('start_time', '>', $pick_date_time);
                            $query->orWhere('end_time', '<', $pick_date_time);
                            $query->where('pick', $pick_location);
                        }
                    )
                    ->whereIn('model', $request->type)
                    ->whereIn('capacity', $request->capacity)
                    ->where('dailyPrice', '<=', $request->price)
                    ->get();
                    return $cars_after_filter;
                }
                //drop
                else{
                    $drop_location = strtolower($request->data[0]['drop']['location']);
                    $drop_date_time = carbon::parse($request->data[0]['drop']['date'] . $request->data[0]['drop']['time']);
                    $cars_after_filter = Car::whereHas(
                        'reservations',
                        function ($query) use ($drop_date_time, $drop_location) {
                            $query->where('start_time', '>', $drop_date_time);
                            $query->orWhere('end_time', '<', $drop_date_time);
                            $query->where('drop', $drop_location);
                        }
                    )
                    ->whereIn('model', $request->type)
                    ->whereIn('capacity', $request->capacity)
                    ->where('dailyPrice', '<=', $request->price)
                    ->get();
                    return $cars_after_filter;
                }
            }
            elseif($req_length==2){
                // both
                $pick_location = strtolower($request->data[0]['pick']['location']);
                $drop_location = strtolower($request->data[1]['drop']['location']);
                $pick_date_time = carbon::parse($request->data[0]['pick']['date'] . $request->data[0]['pick']['time']);
                $drop_date_time = carbon::parse($request->data[1]['drop']['date'] . $request->data[1]['drop']['time']);

                $cars_after_filter = Car::whereHas(
                    'reservations',
                    function ($query) use ($pick_date_time, $drop_date_time, $pick_location, $drop_location) {
                        $query->where('start_time', '>', $pick_date_time)->where('start_time', '>', $drop_date_time);
                        $query->orWhere('end_time', '<', $pick_date_time)->where('end_time', '<', $drop_date_time);
                        $query->where('pick', $pick_location);
                        $query->where('drop', $drop_location);
                    }
                )
                ->whereIn('model', $request->type)
                ->whereIn('capacity', $request->capacity)
                ->where('dailyPrice', '<=', $request->price)
                ->get();
                return $cars_after_filter;
            }
        }
        // maybe no validation required here
        return car::whereIn('model', $request->type)->whereIn('capacity', $request->capacity)->where('dailyPrice', '<=', $request->price)->get();
    }
}
