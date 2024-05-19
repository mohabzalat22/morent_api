<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function index(Request $request){
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
                        function ($query) use ($pick_date_time) {
                            $query->where('start_time', '>', $pick_date_time);
                            $query->orWhere('end_time', '<', $pick_date_time);
                        }
                    )->get();
                    return $cars_after_filter;
                }
                //drop
                else{
                    $drop_location = strtolower($request->data[0]['drop']['location']);
                    $drop_date_time = carbon::parse($request->data[0]['drop']['date'] . $request->data[0]['drop']['time']);
                    $cars_after_filter = Car::whereHas(
                        'reservations',
                        function ($query) use ($drop_date_time) {
                            $query->where('start_time', '>', $drop_date_time);
                            $query->orWhere('end_time', '<', $drop_date_time);
                        }
                    )->get();
                    return $cars_after_filter;
                }
            }
            elseif($req_length==2){
                // both
                // return $request->all();
                // $pick_location = strtolower($request->data[0]['pick']['location']);
                // $drop_location = strtolower($request->data[1]['drop']['location']);
                $pick_date_time = carbon::parse($request->data[0]['pick']['date'] . $request->data[0]['pick']['time']);
                $drop_date_time = carbon::parse($request->data[1]['drop']['date'] . $request->data[1]['drop']['time']);

                $cars_after_filter = Car::whereHas(
                    'reservations',
                    function ($query) use ($pick_date_time, $drop_date_time) {
                        $query->where('start_time', '>', $pick_date_time)->where('start_time', '>', $drop_date_time);
                        $query->orWhere('end_time', '<', $pick_date_time)->where('end_time', '<', $drop_date_time);
                    }
                )
                ->get();
                return $cars_after_filter;
            }
        }
        return Car::all();
    }
}
