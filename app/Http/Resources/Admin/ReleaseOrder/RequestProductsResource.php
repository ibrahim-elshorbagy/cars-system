<?php

namespace App\Http\Resources\Admin\ReleaseOrder;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestProductsResource extends JsonResource
{
        public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */



     // get info from table stock_release_requests

    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,
            'stock_release_order_id' => $this->stock_release_order_id,
            'stock_id' => $this->stock_id,
            'quantity' => $this->quantity,


            'product_name' => $this->whenLoaded('stock', fn() => $this->stock->product->name),
            'product_image' => $this->whenLoaded('stock', fn() => $this->stock->product->image_url),

            'max_quantity' => $this->whenLoaded('stock', fn() => $this->stock->quantity),

            'warehouse_name' => $this->whenLoaded('stock', fn() => $this->stock->warehouse->name),


            'product_category' => $this->whenLoaded('stock', fn() => $this->stock->product->category->name),
            'product_subcategory' => $this->whenLoaded('stock', fn() => $this->stock->product->subCategory->name),

        ];
    }
}
