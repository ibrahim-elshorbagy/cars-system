<?php

namespace App\Http\Resources\Admin\carBill\Bill;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserPaymentsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray($request)
    {
        // 1. Calculate user credit balance:
        $addedCredit = $this->credits->sum('added_credit');
        $usedCredit = $this->credits->sum('used_credit');
        $userCreditBalance = $addedCredit - $usedCredit;

        return [
            // 2. Return the basic Customer information:
            'customer_id' => $this->id,
            'customer_name' => $this->name,
            'customer_company' => $this->customer->customer_company,
            'customer_balance' => $userCreditBalance,

            // 3. Return the customer's associated bills:
            'bills' => $this->bills->map(function ($bill) {

                // 4. Calculate the bill payment amounts for every bill  :
                $shippingCostPaid = $bill->paymentBills()->sum('shipping_cost_amount'); //Total paymentBills(payments on one payment) made for the 'shipping_cost' for this bill.
                $wonPricePaid = $bill->paymentBills()->sum('won_price_amount'); //Total paymentBills(payments on one payment) made for the 'won_price' for this bill

                // 5. Calculate the remaining amounts for every bill :
                $remainShippingCost = $bill->shipping_cost - $shippingCostPaid;
                $remainWonPrice = $bill->won_price - $wonPricePaid;

                // 6. Return the bill information including the car's chassis number, costs, paid amounts, and remaining amounts:
                return [
                    'car'=> $bill->car,
                    'car_chassis' => $bill->car->chassis, // car info for every bill
                    'car_make' => $bill->car && $bill->car->make ? $bill->car->make->name : 'N/A',
                    'car_model' => $bill->car && $bill->car->model ? $bill->car->model->name : 'N/A',

                    'bill_id' => $bill->id, // car info for every bill

                    'shipping_cost' => $bill->shipping_cost, // The total shipping cost for the bill.
                    'shipping_cost_paid_amount' => $shippingCostPaid, // The total paid amount for the shipping cost.
                    'remain_shipping_cost' => $remainShippingCost, // The remaining shipping cost to be paid.

                    'won_price' => $bill->won_price, // The total won price for the bill.
                    'won_price_paid_amount' => $wonPricePaid, // The total paid amount for the won price.
                    'remain_won_price' => $remainWonPrice, // The remaining won price to be paid.


                ];
            }),
        ];
    }



}
