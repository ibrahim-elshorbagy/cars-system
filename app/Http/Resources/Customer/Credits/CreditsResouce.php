<?php

namespace App\Http\Resources\Customer\Credits;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CreditsResouce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        // Get all previous transactions of the current user up to the current transaction's creation date (including the current one)
        $previousTransactions = $this->user->credits()
            ->where('created_at', '<=', $this->created_at)
            ->orderBy('created_at', 'asc') // Ensure ascending order for correct balance calculation
            ->get();

        // Calculate the balance based on all previous transactions
        $balance = $previousTransactions->sum('added_credit') - $previousTransactions->sum('used_credit');

        // Return the resource data
        return [
            'id' => $this->id,
            'added_credit' => $this->added_credit,
            'used_credit' => $this->used_credit,
            'balance' => $balance, // Calculated balance
            'description' => $this->description,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
        ];
    }

}
