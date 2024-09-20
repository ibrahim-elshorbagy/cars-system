<?php

namespace App\Http\Resources\Admin\Box;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoxResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'created_at'=>(new Carbon($this->created_at))->format('Y-m-d'),
            'name'=>$this->name,
            'updated_at'=>(new Carbon($this->updated_at))->format('Y-m-d')
        ];
    }
}
