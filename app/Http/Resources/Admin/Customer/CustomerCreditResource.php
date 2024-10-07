<?php

namespace App\Http\Resources\Admin\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerCreditResource extends JsonResource
{
    public static $wrap = false;

    private static $runningBalances = [];

    public function toArray($request)
        {
            $userId = $this->user->id;

            // Initialize the balance for the user if not set
            if (!isset(self::$runningBalances[$userId])) {
                self::$runningBalances[$userId] = 0;
            }

            // Update the running balance
            self::$runningBalances[$userId] += $this->added_credit - $this->used_credit;
            $balance = self::$runningBalances[$userId];

            return [
                'id' => $this->id,
                'customer_name' => $this->user->name,
                'customer_company' => $this->user->customer->customer_company,
                'customer_id' => $this->user->id,
                'added_credit' => $this->added_credit,
                'used_credit' => $this->used_credit,
                'balance' => $balance,
                'description' => $this->description,
                'box_id' => $this->box_id,
                'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
                'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
                'box_name' => $this->box->name ?? null,
                'created_by' => $this->createdBy->name ?? null,
                'updated_by' => $this->updatedBy->name ?? null,
            ];
        }

}
