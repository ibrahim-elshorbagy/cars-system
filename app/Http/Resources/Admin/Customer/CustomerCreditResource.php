<?php

namespace App\Http\Resources\Admin\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerCreditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
            $previousTransactions = $this->user->credits()->where('created_at', '<=', $this->created_at)->get();
            $balance = $previousTransactions->sum('added_credit') - $previousTransactions->sum('used_credit');

        return
        [
            'id'=>$this->id,
            'customer_name'=>$this->user->name,
            'customer_id'=>$this->user->id,

            'added_credit'=>$this->added_credit,
            'used_credit'=>$this->used_credit,
            'balance' => $balance,

            'description'=>$this->description,
            'box_id'=>$this->box_id,


            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

            'box_name' => $this->box->name ?? null,
            'created_by' => $this->createdBy->name ?? null,
            'updated_by' => $this->updatedBy->name ?? null,

            'cant' => $this->used_credit > $this->added_credit ? true : false,

        ];
    }
}
