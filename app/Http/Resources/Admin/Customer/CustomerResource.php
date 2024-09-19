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
        return [
            "id" => $this->id,
            "name" => $this->name,
            "email" => $this->email,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'address' => $this->whenLoaded('customer', function () {
                return $this->customer->address;
            }),
            'phone' => $this->whenLoaded('customer', function () {
                return $this->customer->phone;
            }),

        ];
    }
}
