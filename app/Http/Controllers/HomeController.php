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
                    $location = strtolower($request->data[0]['pick']['location']);
                    $filter_reservation_date = carbon::parse($request->data[0]['pick']['date'] . $request->data[0]['pick']['time']);
                    $reservation = Reservation::with('car')
                    ->where('pick', $location)
                    ->where(function ($query) use ($filter_reservation_date) {
                        $query->where('start_time', '>' ,$filter_reservation_date);
                        $query->orWhere('end_time', '<' ,$filter_reservation_date);
                    })
                    ->get();
                    return $reservation;
                }
                //drop
                else{
                    $location = strtolower($request->data[0]['drop']['location']);
                    $filter_reservation_date = carbon::parse($request->data[0]['drop']['date'] . $request->data[0]['drop']['time']);
                    $reservation = Reservation::with('car')
                    ->where('drop', $location)
                    ->where(function ($query) use ($filter_reservation_date) {
                        $query->where('start_time', '>' ,$filter_reservation_date);
                        $query->orWhere('end_time', '<' ,$filter_reservation_date);
                    })
                    ->get();
                    return $reservation;
                }
            }
            elseif($req_length==2){
                // both
                return $request->data;
            }
        }
        return Car::all();
    }
}
