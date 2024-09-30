<?php

namespace App\Http\Resources\Admin\CarBill\Bill\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomersBillsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $addedCredit = $this->credits->sum('added_credit');
        $usedCredit = $this->credits->sum('used_credit');

        // Calculate the correct total paid amount using the payments and payment_bills tables
        $paid = $this->bills->flatMap(function ($bill) {
            // For each bill, sum up the payment amounts from payment_bills table
            return $bill->paymentBills->map(function ($paymentBill) {
                return $paymentBill->won_price_amount + $paymentBill->shipping_cost_amount;
            });
        })->sum();

        $balance = $addedCredit - $usedCredit;
        $totalBillsCount = $this->bills->count();
        $totalDues = $this->bills->sum(function ($bill) {
            return $bill->shipping_cost + $bill->won_price;
        });

        return [
            'id' => $this->id,
            'name' => $this->name,
            'customer_company' => $this->customer->customer_company,
            'email' => $this->email,
            'whatsapp' => $this->whatsapp,
            'phone' => $this->phone,
            'balance' => $balance,
            'total_bills_count' => $totalBillsCount,
            'total_dues' => $totalDues,
            'paid_amount' => $paid,
        ];
    }

}
