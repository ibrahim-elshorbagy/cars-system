<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerProductsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'warehouse_id' =>  $this->whenLoaded('warehouse',function(){return $this->warehouse->id;}),
            'warehouse_name' =>  $this->whenLoaded('warehouse',function(){return $this->warehouse->name;}),

            'product_id' =>  $this->whenLoaded('product',function(){return $this->product->id;}),
            'product_name' =>  $this->whenLoaded('product',function(){return $this->product->name;}),
            'product_image' =>  $this->whenLoaded('product',function(){return $this->product->image_url;}),
            'quantity' => $this->quantity,

        ];
    }
}
