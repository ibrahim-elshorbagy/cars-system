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
            'user_name'=>$this->user_name,
            "email" => $this->email,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'phone'=>$this->phone,
            'whatsapp'=>$this->whatsapp,
            'customer_company'=>$this->customer->customer_company,

        ];
    }
}
