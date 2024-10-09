<?php

namespace App\Http\Resources\Admin\CarBill\Bill\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class BillsDetailsResource extends JsonResource
{
    public static $wrap = false;
    public function toArray($request)
    {
        return $this->cars->map(function ($car) {
            $bill = $car->bill;

            // Calculate the total paid for won_price and shipping_cost
            $totalWonPricePaid = $bill->paymentBills->where('won_price_amount', '>', 0)->sum('won_price_amount');
            $totalShippingCostPaid = $bill->paymentBills->where('shipping_cost_amount', '>', 0)->sum('shipping_cost_amount');

            return [

                'customer_name' =>$this->name,
                'customer_company' =>$this->customer->customer_company,
                'car_chassis' => $car->chassis,
                'car_year' =>$car->year ,

                'model_id' => $car->model_id,
                'make_id' => $car->make_id,
                'car_make' => $car->make->name ,
                'car_model' =>$car->model->name ,
                'won_price' => [
                    'amount' => $bill->won_price,
                    'total_paid' => $totalWonPricePaid,
                    'payments' => $bill->paymentBills
                        ->where('won_price_amount', '>', 0)
                        ->map(function ($paymentBill) {
                            return [
                                'won_price_amount' => $paymentBill->won_price_amount,
                                'payment_id' => $paymentBill->payment->id,
                                'payment_date' =>  (new Carbon($paymentBill->payment->created_at))->format('Y-m-d'),

                            ];
                        })
                        ->values(),
                ],
                'shipping_cost' => [
                    'amount' => $bill->shipping_cost,
                    'total_paid' => $totalShippingCostPaid,
                    'payments' => $bill->paymentBills
                        ->where('shipping_cost_amount', '>', 0)
                        ->map(function ($paymentBill) {
                            return [
                                'shipping_cost_amount' => $paymentBill->shipping_cost_amount,
                                'payment_id' => $paymentBill->payment->id,
                                'payment_date' => $paymentBill->payment->created_at,
                                'payment_date' =>  (new Carbon($paymentBill->payment->created_at))->format('Y-m-d'),

                            ];
                        })
                        ->values(),
                ],
            ];
        });
    }


}
