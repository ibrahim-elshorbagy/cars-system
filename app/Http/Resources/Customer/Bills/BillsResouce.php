<?php

namespace App\Http\Resources\Customer\Bills;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillsResouce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
        public function toArray($request)
        {
            // Ensure paymentBills is not null before summing
            $paidWonPrice = $this->bill->paymentBills ? $this->bill->paymentBills->sum('won_price_amount') : 0;

            // Ensure paymentBills is not null before summing
            $paidShippingCost = $this->bill->paymentBills ? $this->bill->paymentBills->sum('shipping_cost_amount') : 0;

            // Calculate remaining amounts
            $remainWonPrice = $this->bill->won_price - $paidWonPrice;
            $remainShippingCost = $this->bill->shipping_cost - $paidShippingCost;

            return [
                'id' => $this->id,
                'chassis' => $this->chassis ?? null,
                'make_name'=> $this->make->name ?? null,
                'model_name'=> $this->model->name ?? null,
                'year'=> $this->year ?? null,
                'shipping_cost' => $this->bill->shipping_cost ?? null,
                'paid_shipping_cost' => $paidShippingCost,
                'remain_shipping_cost' => $remainShippingCost,

                'won_price' => $this->bill->won_price ?? null,
                'paid_won_price' => $paidWonPrice,
                'remain_won_price' => $remainWonPrice,

            ];
        }

}
