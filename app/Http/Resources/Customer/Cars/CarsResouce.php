<?php

namespace App\Http\Resources\Customer\Cars;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarsResouce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ,
            'chassis' => $this->chassis ?? null,
            'ship_status' => $this->ship_status ?? null,
            'won_price' => $this->bill->won_price ?? null,
            'shipping_cost' => $this->bill->shipping_cost ?? null,

        ];
    }
}
