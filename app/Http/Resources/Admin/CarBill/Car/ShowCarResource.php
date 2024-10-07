<?php

namespace App\Http\Resources\Admin\CarBill\Car;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ShowCarResource extends JsonResource
{
        public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ,
            'user_id' => $this->user_id ?? null,
            'box_id' => $this->bill->box_id ?? null,




            'color'=>$this->color ?? null,
            'year'=>$this->year ?? null,
            'chassis' => $this->chassis ?? null,

            'customer_name' => $this->user->name ?? null,
            'customer_id' => $this->user->id ?? null,
            'customer_company' => $this->user->customer->customer_company ?? null,

            'title'=>$this->title ?? null,
            'keys'=>$this->keys ?? null,

            'lot'=>$this->lot ?? null,

            'bookingNo'=>$this->bookingNo ?? null,
            'container_number'=>$this->container_number ?? null,


            'vendor_name' => $this->vendor->name ?? null,
            'vendor_id' => $this->vendor->id ?? null,
            'destination_name' => $this->destination->name ?? null,
            'destination_id' => $this->destination->id ?? null,
            'line_name' => $this->line->name ?? null,
            'line_website' => $this->line->line_website ?? null,
            'line_id' => $this->line->id ?? null,
            'terminal_name' => $this->terminal->name ?? null,
            'terminal_id' => $this->terminal->id ?? null,
            'make_name' => $this->make->name ?? null,
            'make_id' => $this->make->id ?? null,
            'model_name' => $this->model->name ?? null,
            'model_id' => $this->model->id ?? null,
            'facility_name' => $this->facility->name ?? null,
            'facility_id' => $this->facility->id ?? null,

            'images' => $this->carImages->pluck('image_url') ?? [],

            'ship_status' => $this->ship_status ?? null,



            'won_price' => $this->bill->won_price ?? null,

            'shipping_expenses' => $this->whenLoaded('bill', function () {
                return $this->bill->shippingExpenses->map(function ($expense) {
                    $name = $expense->shippingFeeType->name;
                    $ar_name = $expense->shippingFeeType->ar_name;
                    $formatted_name = "{$name} ({$ar_name})";

                    return [
                        'expense_id' => $expense->id, // the id of the expense
                        'fee_id'     => $expense->shipping_fee_type_id, //the fee we use
                        'name'       => $formatted_name,
                        'amount'     => $expense->amount,

                        'created_at' => optional(new Carbon($expense->created_at))->format('Y-m-d'),
                        'created_by_name'=>optional($expense->creator)->name,

                        'updated_at' => optional(new Carbon($expense->updated_at))->format('Y-m-d'),
                        'updated_by_name'=>optional($expense->updater)->name,

                        // 'created_by_id'=>$expense->created_by,
                        // 'updated_by_id'=> $expense->updated_by,

                    ];
                });
            }),


            'shipping_cost' => $this->bill->shipping_cost ?? null,



            'estimate_arrival_date' => $this->estimate_arrival_date ?? null,
            'arrival_date' => $this->arrival_date ?? null,
            'date_won' => $this->date_won ?? null,

            'carfax_report' => $this->carfax_report ?? null,
            'carfax_report_url' => $this->carfax_report ? Storage::url($this->carfax_report) : null,

            'created_by' => $this->createdBy->name ?? null,
            'updated_by' => $this->updatedBy->name ?? null,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),


        ];
    }
}
