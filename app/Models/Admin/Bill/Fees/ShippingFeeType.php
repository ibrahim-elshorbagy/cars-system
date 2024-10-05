<?php

namespace App\Models\Admin\Bill\Fees;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingFeeType extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];


    public function expenses()
    {
        return $this->hasMany(ShippingExpens::class, 'shipping_fee_type_id');
    }
}

