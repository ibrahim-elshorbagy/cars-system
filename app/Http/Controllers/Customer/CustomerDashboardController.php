<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\CarBill\Car\ShowCarResource;
use App\Http\Resources\Customer\Bills\BillsResouce;
use App\Http\Resources\Customer\Cars\CarsResouce;
use App\Http\Resources\Customer\Credits\CreditsResouce;
use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Bill\PaymentBill;
use App\Models\Admin\Car\Car;
use App\Models\Admin\Customer\CustomerCredit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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


        if (request("chassis")) {
            $query->where("chassis", "like", "%" . request("chassis") . "%");
        }

        $cars = $query->paginate(25)->onEachSide(1);


        // Calculate the customer balance
        $customer_balance = CustomerCredit::where('user_id', $userId)->sum('added_credit')
                            - CustomerCredit::where('user_id', $userId)->sum('used_credit');

        // Calculate the total won price and shipping cost
        $total_won_price = Bill::where('user_id', $userId)->sum('won_price');
        $total_shipping_cost = Bill::where('user_id', $userId)->sum('shipping_cost');

        // Total amount required
        $total_require = $total_shipping_cost + $total_won_price;

        // Calculate the total amount paid (sum of won_price_amount and shipping_cost_amount)
        $total_paid = PaymentBill::whereHas('bill', function($query) use ($userId) {
                                $query->where('user_id', $userId);
                            })->sum(DB::raw('won_price_amount + shipping_cost_amount'));


        return inertia("Customer/Bill/Index", [

            "cars" => BillsResouce::collection($cars),
            'queryParams' => request()->query() ?: null,
            'customer_balance' => $customer_balance,
            'total_won_price' => $total_won_price,
            'total_shipping_cost' => $total_shipping_cost,
            'total_require' => $total_require,
            'total_paid' => $total_paid,

        ]);
    }
}
