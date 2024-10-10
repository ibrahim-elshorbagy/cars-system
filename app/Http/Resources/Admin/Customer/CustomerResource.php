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

         // Initialize variables
        $addedCredit = null;
        $usedCredit = null;
        $addedCreditId = null;
        $usedCreditId = null;

        // Ensure there are exactly two credits
        if ($this->credits->count() == 2) {
            $first = $this->credits[0];
            $second = $this->credits[1];

            if ($first->added_credit > $second->added_credit) {
                $addedCredit = $first->added_credit;
                $addedCreditId = $first->id;

                $usedCredit = $second->used_credit;
                $usedCreditId = $second->id;
            } else {
                $addedCredit = $second->added_credit;
                $addedCreditId = $second->id;

                $usedCredit = $first->used_credit;
                $usedCreditId = $first->id;
            }
        } else {
            // Handle cases where credits are not exactly two
            // You can log an error, throw an exception, or assign default values
            // For this example, we'll assign default values
            $addedCredit = "0.00";
            $usedCredit = "0.00";
            $addedCreditId = null;
            $usedCreditId = null;
        }

        return [
            "id" => $this->id,
            "name" => $this->name,
            'user_name'=>$this->user_name,
            "email" => $this->email,

            // Assign added_credit and used_credit
            'added_credit' => $addedCredit ?? "0.00",
            'used_credit' => $usedCredit ?? "0.00",

            // Assign the corresponding credit IDs
            'added_credit_id' => $addedCreditId,
            'used_credit_id' => $usedCreditId,

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
            'phone'=>$this->phone,
            'whatsapp'=>$this->whatsapp,
            'customer_company'=>$this->customer->customer_company,
            'created_by' => $this->customer->createdBy->name ?? null,
            'updated_by' => $this->customer->updatedBy->name ?? null,

        ];
    }
}
