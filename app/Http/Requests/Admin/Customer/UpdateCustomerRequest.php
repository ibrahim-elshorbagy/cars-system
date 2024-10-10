<?php

namespace App\Http\Requests\Admin\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateCustomerRequest extends FormRequest
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
          $customer = $this->route('customer');
        return [
            "name" => ["required", "string"],
            "user_name" => [
                "required",
                "string",
                Rule::unique('users')->ignore($customer),
            ],
            "email" => [
                "required",
                "email",
                Rule::unique('users')->ignore($customer),
            ],
            "password" => [
                'nullable',
                Password::min(8)->letters(),
            ],
            'phone'=>['nullable','string', 'regex:/^\+[1-9]\d{1,14}$/'],
            'whatsapp'=>["nullable",'string', 'regex:/^\+[1-9]\d{1,14}$/'],
            'customer_company'=>["nullable",'string'],

            'added_credit_id' => ['nullable', 'exists:customer_credits,id'],
            'added_credit' => ['nullable', 'numeric', 'min:0'],
            'used_credit_id' => ['nullable', 'exists:customer_credits,id'],
            'used_credit' => ['nullable', 'numeric', 'min:0'],

        ];
    }
}
