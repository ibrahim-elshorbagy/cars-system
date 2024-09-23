<?php

namespace App\Http\Resources\Admin\CarBill\Car;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'chassis'=>$this->chassis,
            'user_id'=>$this->user_id,
            'customer_name'=>$this->user->name,
        ];
    }
}
