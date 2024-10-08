<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Port extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];

    public function shippingPlans()
    {
        return $this->hasMany(ShippingPlan::class);
    }
     public function cities()
    {
        return $this->hasMany(City::class);
    }

}
