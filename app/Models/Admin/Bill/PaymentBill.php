<?php

namespace App\Models\Admin\Bill;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentBill extends Model
{
    use HasFactory;
            protected $guarded = ['id'];

    public function bill(){
        return $this->belongsTo(Bill::class);
    }

     public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
