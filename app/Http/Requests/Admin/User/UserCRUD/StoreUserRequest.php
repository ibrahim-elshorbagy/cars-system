<?php

namespace App\Http\Requests\Admin\User\UserCRUD;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
            "user_name" => ["required", "string", "unique:users,user_name"],
            "email" => ["required", "string", "email", "unique:users,email"],
            "phone" => ["nullable", "string", 'regex:/^\+[1-9]\d{1,14}$/'],
            "whatsapp" => ["nullable", "string", 'regex:/^\+[1-9]\d{1,14}$/'],

            "password" => [
                "required",
                Password::min(8)->letters(),
            ],
            "role" => ["required"],
            "box_id"=>["nullable","exists:boxes,id"],
        ];
    }
}
