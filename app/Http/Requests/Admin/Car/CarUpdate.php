<?php

namespace App\Http\Requests\Admin\car;

use Illuminate\Foundation\Http\FormRequest;

class CarUpdate extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|numeric',

            'chassis' => 'required|string',
            'lot' => 'nullable|string',
            'bookingNo' => 'nullable|string',
            'container_number' => 'nullable|string',
            'color' => 'required|string',
            'year' => 'required|integer',
            'keys' => 'nullable|boolean',
            'title' => 'nullable|boolean',
            'vendor_id' => 'nullable|exists:vendors,id',
            'destination_id' => 'nullable|exists:destinations,id',
            'line_id' => 'nullable|exists:lines,id',
            'terminal_id' => 'nullable|exists:terminals,id',
            'make_id' => 'required|exists:makes,id',
            'model_id' => 'required|exists:models,id',
            'facility_id' => 'nullable|exists:facilities,id',
            'date_won' => 'nullable|date',
            'estimate_arrival_date' => 'nullable|date',
            'arrival_date' => 'nullable|date',

            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif',  // Validation for new images
            'old_images_url' => 'nullable|array',
            'old_images_url.*.image_url' => 'required|string',


            'carfax_report' => $this->carfax_report_is_file() ? 'nullable|mimes:pdf' : 'nullable|string',

            'box_id'=>'nullable|exists:boxes,id',
            'shipping_cost' => 'nullable|numeric|min:0',
            'won_price' => 'nullable|numeric|min:0',
            'ship_status' => 'nullable|string',

            'shipping_expenses' => 'nullable|array',

            'shipping_expenses.*.expense_id' => [
                'nullable',
                'integer',
            ],
            'shipping_expenses.*.fee_id' => [
                'nullable',
                'required_with:shipping_expenses.*.amount',
                'exists:shipping_fee_types,id',
            ],
            'shipping_expenses.*.amount' => [
                'required_with:shipping_expenses.*.fee_id',
                'numeric',
                'min:1',
            ],
            'shipping_expenses.*.created_at' => [
                'date',
            ],
            'shipping_expenses.*.create_date' => [
                'date',
                'required_without:shipping_expenses.*.created_at',
            ],

        ];
    }
    protected function carfax_report_is_file()
    {
        return request()->hasFile('carfax_report');
    }
}
