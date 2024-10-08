<?php

namespace App\Http\Requests\Admin\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreCustomerRequest extends FormRequest
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
            "name" => ["required", "string"],
            "email" => ["required", "string", "email", "unique:users,email"],
            "user_name" => ["required", "string", "unique:users,user_name"],
            "password" => [
                "required",
                Password::min(8)->letters(),
            ],
            'phone'=>['nullable','string', 'regex:/^\+[1-9]\d{1,14}$/'],
            'whatsapp'=>["nullable",'string', 'regex:/^\+[1-9]\d{1,14}$/'],
            'customer_company'=>["nullable",'string'],

            'added_credit' => ['nullable', 'numeric', 'min:0'],
            'used_credit' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
