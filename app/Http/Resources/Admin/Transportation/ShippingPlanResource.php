<?php

namespace App\Http\Resources\Admin\Transportation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $destinations = $this->shippingPlans->groupBy('destination_id')->map(function ($plans, $destinationId) {
            $destination = $plans->first()->destination;
            $cities = $plans->map(function ($plan) {
                return [
                    'id' => $plan->city->id,
                    'name' => $plan->city->name,
                    'code' => $plan->city->code,
                    'shipping_fee' => $plan->shipping_fee,
                ];
            });

            return [
                'id' => $destination->id,
                'name' => $destination->name,
                'cities' => $cities,
            ];
        });

        return [
            'id' => $this->id,
            'name' => $this->name,
            'destinations' => $destinations->values(),
        ];

    }
}
