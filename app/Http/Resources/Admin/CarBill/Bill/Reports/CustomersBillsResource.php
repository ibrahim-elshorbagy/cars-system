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
        $balance = $addedCredit - $usedCredit;

        $totalBillsCount = $this->bills->count();
        $totalDues = $this->bills->sum(function ($bill) {
            return $bill->shipping_cost + $bill->won_price;
        });

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'whatsapp'=>$this->whatsapp,
            'phone'=>$this->phone,
            'balance' => $balance,
            'total_bills_count' => $totalBillsCount,
            'total_dues' => $totalDues,
            'paid_amount' => $usedCredit,
        ];
    }
}
