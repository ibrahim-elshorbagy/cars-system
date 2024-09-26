<?php

namespace App\Http\Requests\Admin\Car;

use Illuminate\Foundation\Http\FormRequest;

class CarStore extends FormRequest
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
        $rules =  [
            'user_id' => 'required|numeric',
            'chassis' => 'required|string',
            'lot' => 'nullable|string',
            'bookingNo' => 'nullable|string',
            'container_number' => 'nullable|string',
            'color' => 'required|string',
            'year' => 'required|integer',
            'keys' => 'nullable',
            'title' => 'nullable',
            'vendor_id' => 'nullable|exists:vendors,id',
            'destination_id' => 'nullable|exists:destinations,id',
            'line_id' => 'nullable|exists:lines,id',
            'terminal_id' => 'nullable|exists:terminals,id',
            'make_id' => 'nullable|exists:makes,id',
            'model_id' => 'nullable|exists:models,id',
            'facility_id' => 'nullable|exists:facilities,id',
            'date_won' => 'nullable|date',
            'estimate_arrival_date' => 'nullable|date',
            'arrival_date' => 'nullable|date',
            'ship_status' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif',
            'carfax_report' => 'nullable|mimes:pdf',

            'won_price' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',

        ];



        return $rules;

    }
}
