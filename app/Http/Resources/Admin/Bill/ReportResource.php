<?php

namespace App\Http\Resources\Admin\Bill;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public $wrap = false;
    public function toArray(Request $request): array
    {
        return [
            'user_id'=>$this->user_id,
            'user_name'=>$this->user->name,
            'added_credit'=>$this->added_credit,
            'used_credit'=>$this->used_credit,
            'description'=>$this->description,
        ];
    }
}
