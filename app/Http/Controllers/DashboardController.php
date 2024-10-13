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
use App\Models\Admin\Box\Box;
use App\Models\Admin\Box\BoxTransaction;
use App\Models\Admin\Car\Car;

class DashboardController extends Controller
{





    public function AdminDashboard()
    {
        $carStatusCounts = Car::selectRaw('ship_status, COUNT(*) as count')
            ->groupBy('ship_status')
            ->pluck('count', 'ship_status');

        $boxes = []; // Array to hold box information

        if (Auth::user()->hasRole('Accountant')) {
            // Fetch only the accountant's assigned box
            $boxId = Auth::user()->accountant->box_id;
            $totals = BoxTransaction::where('box_id', $boxId)
                ->selectRaw('box_id, SUM(income) as total_income, SUM(outcome) as total_outcome')
                ->groupBy('box_id')
                ->first();

            $boxes[] = [
                'box' => Box::find($boxId),
                'total_income' => $totals->total_income ?? 0,
                'total_outcome' => $totals->total_outcome ?? 0,
                'net_balance' => ($totals->total_income ?? 0) - ($totals->total_outcome ?? 0),
            ];

        } elseif (Auth::user()->hasRole('admin')) {
            // Get all boxes even if they don't have transactions
            $allBoxes = Box::all();

            // Get totals for boxes that have transactions
            $totals = BoxTransaction::selectRaw('box_id, SUM(income) as total_income, SUM(outcome) as total_outcome')
                ->groupBy('box_id')
                ->get()
                ->keyBy('box_id');

            // Loop through all boxes and add their totals or zero values
            foreach ($allBoxes as $box) {
                $income = $totals->has($box->id) ? $totals[$box->id]->total_income : 0;
                $outcome = $totals->has($box->id) ? $totals[$box->id]->total_outcome : 0;

                $boxes[] = [
                    'box' => $box,
                    'total_income' => $income,
                    'total_outcome' => $outcome,
                    'net_balance' => $income - $outcome,
                ];
            }
        }

        return inertia('Admin/Dashboard', [
            'carStatusCounts' => $carStatusCounts,
            'boxes' => $boxes,
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

        $carsCount = Car::where('user_id', $userId)->count();


        return inertia('Customer/Dashboard',[
            'customer_balance' => $customer_balance,
            'total_won_price' => $total_won_price,
            'total_shipping_cost' => $total_shipping_cost,
            'total_require' => $total_require,
            'total_paid' => $total_paid,
            'carsCount' => $carsCount,

        ]);
    }



}
