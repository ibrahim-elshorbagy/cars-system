<?php

namespace App\Http\Resources\Admin\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class UserCRUDResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "user_name" => $this->user_name,
            'box_id'=>$this->accountant->box_id ?? null,
            "email" => $this->email,
            "role"=> $this->roles->pluck('name'),
            "role_id"=> $this->roles->pluck('id'),
            'phone'=>$this->phone,
            'whatsapp'=>$this->whatsapp,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'roles' => $this->roles->pluck('id')
        ];
    }
}
