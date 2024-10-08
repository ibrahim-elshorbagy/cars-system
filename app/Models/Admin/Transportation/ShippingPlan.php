<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingPlan extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function port()
    {
        return $this->belongsTo(Port::class);
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
