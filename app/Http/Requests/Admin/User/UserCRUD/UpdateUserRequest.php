<?php

namespace App\Http\Requests\Admin\User\UserCRUD;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;


class UpdateUserRequest extends FormRequest
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
        $user = $this->route("user");
        return [
            "name" => ["required", "string", "max:255"],
            "user_name" => ["required", "string", Rule::unique('users')->ignore($user->id),],

            "email" => [
                "required",
                "email",
                Rule::unique('users')->ignore($user->id),
            ],
            "phone" => ["nullable", "string", 'regex:/^\+[1-9]\d{1,14}$/'],
            "whatsapp" => ["nullable", "string", 'regex:/^\+[1-9]\d{1,14}$/'],
            "password" => [
                'nullable',
                Password::min(8)->letters(),
            ],
            "role" => ["required", "integer"],
            'box_id' => [
                Rule::requiredIf(fn() => $this->input('role') == 4),
                'nullable',
                'exists:boxes,id'
        ],
        ];
    }
}
