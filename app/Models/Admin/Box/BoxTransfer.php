<?php

namespace App\Models\Admin\Box;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoxTransfer extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function fromBox()
    {
        return $this->belongsTo(Box::class, 'from_box_id');
    }


    public function toBox()
    {
        return $this->belongsTo(Box::class, 'to_box_id');
    }
}
