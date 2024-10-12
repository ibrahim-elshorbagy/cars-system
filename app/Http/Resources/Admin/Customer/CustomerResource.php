<?php

namespace App\Http\Resources\Admin\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerResource extends JsonResource
{
        public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        // Initialize variables with default values
        $addedCredit = "0.00";
        $usedCredit = "0.00";
        $addedCreditId = null;
        $usedCreditId = null;

        // Loop through the credits and assign values
        foreach ($this->credits as $credit) {
            if (!is_null($credit->added_credit) && $credit->added_credit > 0) {
                $addedCredit = $credit->added_credit;
                $addedCreditId = $credit->id;
            }
            if (!is_null($credit->used_credit) && $credit->used_credit > 0) {
                $usedCredit = $credit->used_credit;
                $usedCreditId = $credit->id;
            }
        }

        return [
            "id" => $this->id,
            "name" => $this->name,
            'user_name' => $this->user_name,
            "email" => $this->email,
            'added_credit' => $addedCredit,
            'used_credit' => $usedCredit,
            'added_credit_id' => $addedCreditId,
            'used_credit_id' => $usedCreditId,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'customer_company' => $this->customer->customer_company,
            'created_by' => $this->customer->createdBy->name ?? null,
            'updated_by' => $this->customer->updatedBy->name ?? null,
        ];
    }
}
