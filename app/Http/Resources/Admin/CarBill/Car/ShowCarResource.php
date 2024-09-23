<?php

namespace App\Http\Resources\Admin\CarBill\Car;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ShowCarResource extends JsonResource
{
        public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ,
            'user_id' => $this->user_id ?? null,
            'title'=>$this->title ?? null,
            'keys'=>$this->keys ?? null,
            'lot'=>$this->lot ?? null,
            'bookingNo'=>$this->bookingNo ?? null,
            'color'=>$this->color ?? null,
            'year'=>$this->year ?? null,
            'chassis' => $this->chassis ?? null,
            'customer_name' => $this->user->name ?? null,
            'customer_id' => $this->user->id ?? null,
            'vendor_name' => $this->vendor->name ?? null,
            'vendor_id' => $this->vendor->id ?? null,
            'destination_name' => $this->destination->name ?? null,
            'destination_id' => $this->destination->id ?? null,
            'line_name' => $this->line->name ?? null,
            'line_id' => $this->line->id ?? null,
            'terminal_name' => $this->terminal->name ?? null,
            'terminal_id' => $this->terminal->id ?? null,
            'make_name' => $this->make->name ?? null,
            'make_id' => $this->make->id ?? null,
            'model_name' => $this->model->name ?? null,
            'model_id' => $this->model->id ?? null,
            'facility_name' => $this->facility->name ?? null,
            'facility_id' => $this->facility->id ?? null,
            'carfax_report' => $this->carfax_report ?? null,
            'images' => $this->carImages->pluck('image_url') ?? [],
            'ship_status' => $this->ship_status ?? null,
            'won_price' => $this->won_pirce ?? null,
            'shipping_cost' => $this->shipping_cost ?? null,
            'estimate_arrival_date' => $this->estimate_arrival_date ?? null,
            'arrival_date' => $this->arrival_date ?? null,
            'date_won' => $this->date_won ?? null,
            'carfax_report_url'=> Storage::url($this->carfax_report)  ?? null,
        ];
    }
}