<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\CarBill\Car\ShowCarResource;
use App\Http\Resources\Customer\Bills\BillsResouce;
use App\Http\Resources\Customer\Cars\CarsResouce;
use App\Http\Resources\Customer\Credits\CreditsResouce;
use App\Models\Admin\Car\Car;
use App\Models\Admin\Customer\CustomerCredit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerDashboardController extends Controller
{
    public function CarsIndex()
    {
        $userId = Auth::id();

        $query = Car::where('user_id', $userId)->with('bill')->orderBy("id", "desc");

        if (request("chassis")) {
            $query->where("chassis", "like", "%" . request("chassis") . "%");
        }

        $cars = $query->paginate(25)->onEachSide(1);




        return inertia("Customer/Car/Index", [

            "cars" => CarsResouce::collection($cars),
            'queryParams' => request()->query() ?: null,

        ]);
    }
        public function CarShow(Car $car){

        return inertia("Customer/Car/Show", [
            'car' => new ShowCarResource($car),
        ]);

    }









    public function CreditsIndex(){
        $userId = Auth::id();
        $query = CustomerCredit::query()->where('user_id', $userId);

        $records = $query->orderBy('created_at','desc')->paginate(25)->onEachSide(1);

        return inertia("Customer/Credit/Index", [
            "records" => CreditsResouce::collection($records),
        ]);
    }




    public function BillsIndex(){
        $userId = Auth::id();

        $query = Car::where('user_id', $userId)->with('bill.paymentBills')->orderBy("id", "desc");

        $customer_balance = CustomerCredit::where('user_id', $userId)->sum('added_credit') - CustomerCredit::where('user_id', $userId)->sum('used_credit');

        if (request("chassis")) {
            $query->where("chassis", "like", "%" . request("chassis") . "%");
        }

        $cars = $query->paginate(25)->onEachSide(1);




        return inertia("Customer/Bill/Index", [

            "cars" => BillsResouce::collection($cars),
            'queryParams' => request()->query() ?: null,
            'customer_balance' => $customer_balance

        ]);
    }
}
