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
        return [
            'user_id' => 'required|numeric',
            'chassis' => 'required|string',
            'lot' => 'required|string',
            'bookingNo' => 'required|string',
            'color' => 'required|string',
            'year' => 'required|integer',
            'keys' => 'nullable',
            'title' => 'nullable',
            'vendor_id' => 'required|exists:vendors,id',
            'destination_id' => 'required|exists:destinations,id',
            'line_id' => 'required|exists:lines,id',
            'terminal_id' => 'required|exists:terminals,id',
            'make_id' => 'required|exists:makes,id',
            'model_id' => 'required|exists:models,id',
            'facility_id' => 'required|exists:facilities,id',
            'date_won' => 'required|date',
            'estimate_arrival_date' => 'required|date',
            'arrival_date' => 'required|date',
            'won_pirce' => 'required|numeric|min:0',
            'shipping_cost' => 'required|numeric|min:0',
            'ship_status' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif',
            'carfax_report' => 'nullable|mimes:pdf',
        ];
    }
}