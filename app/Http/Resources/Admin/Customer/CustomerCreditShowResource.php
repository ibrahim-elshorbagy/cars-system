<?php

namespace App\Http\Resources\Admin\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerCreditShowResource extends JsonResource
{
    public static $wrap = false;

    private $initialBalance;

    public function __construct($resource, $initialBalance = 0)
    {
        parent::__construct($resource);
        $this->initialBalance = $initialBalance;
    }

    public function toArray($request)
    {
        // Adjust balance based on the current record's credits
        $balance = $this->initialBalance + $this->added_credit - $this->used_credit;

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
