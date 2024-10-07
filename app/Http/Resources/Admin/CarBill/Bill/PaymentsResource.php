<?php

namespace App\Http\Resources\Admin\CarBill\Bill;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PaymentsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'customer_id' => $this->customer->id,
            'customer_name' => $this->customer->name,
            'customer_company'=>$this->customer->customer->customer_company,
            'total_amount' => $this->total_amount,

            'created_by' => $this->createdBy->name,
            'updated_by' => $this->updatedBy->name ?? null,

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

            'paid_bills' => $this->paymentBills->map(function ($paymentBill) {
                return [
                    'payment_bill_id'=>$paymentBill->id,
                    'bill_id'=>$paymentBill->bill_id,
                    'payment_id' => $paymentBill->payment_id,
                    'won_price_paid_on_bill' => $paymentBill->won_price_amount ,
                    'shipping_cost_paid_on_bill' =>$paymentBill->shipping_cost_amount ,
                ];
            })

        ];

    }
}
