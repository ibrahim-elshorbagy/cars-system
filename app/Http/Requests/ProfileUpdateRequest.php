<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'phone' => ['nullable', 'regex:/^\+[1-9]\d{1,14}$/', 'max:255'],
            'whatsapp' => ['nullable', 'regex:/^\+[1-9]\d{1,14}$/', 'max:255'],
        ];

        if ($this->user()->hasRole('customer')) {
            $rules['customer_company'] = ['required', 'string'];
        } else {
            $rules['customer_company'] = ['nullable', 'string'];
        }

        return $rules;
    }
}
