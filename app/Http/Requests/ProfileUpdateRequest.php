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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'phone'=>['nullable','regex:/^[0-9]+$/','max:255',Rule::unique('customers')->where(function ($query) {return $query->where('user_id', $this->user()->id);})->ignore($this->route('customer')->id ?? null)],
            'address'=>["nullable",'string'],
        ];
    }
}
