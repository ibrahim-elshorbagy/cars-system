<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Customer\CustomerCredit;
use App\Models\Admin\Bill\PaymentBill;

class DashboardController extends Controller
{

    // public function markAsRead($id,$order)
    // {
    //     $user = Auth::user();

    //     $notification= $user->notifications()->where('id', $id)->first();

    //     $notification->markAsRead();

    //     return to_route('admin.show.order',$order);
    // }



    public function AdminDashboard()
    {



        // Passing data to the frontend
        return inertia('Admin/Dashboard', [

        ]);
    }






    public function CustomerDashboard()
    {


        $userId = Auth::id();
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


        return inertia('Customer/Dashboard',[
            'customer_balance' => $customer_balance,
            'total_won_price' => $total_won_price,
            'total_shipping_cost' => $total_shipping_cost,
            'total_require' => $total_require,
            'total_paid' => $total_paid,

        ]);
    }



}
