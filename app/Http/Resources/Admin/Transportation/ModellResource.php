<?php

namespace App\Http\Resources\Admin\Transportation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModellResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return      [
            'id'=>$this->id,
            'name'=>$this->name,
            'make_id'=>$this->make_id,
            'make_name'=>$this->make->name,
        ];
    }
}
