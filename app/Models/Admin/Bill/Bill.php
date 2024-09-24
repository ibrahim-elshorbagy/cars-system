<?php

namespace App\Models\Admin\Bill;

use App\Models\Admin\Car\Car;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A bill belongs to a car
    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    // A bill has many paymentBills Representing the payments made for bills on one payment
    public function paymentBills()
    {
        return $this->hasMany(PaymentBill::class);
    }
}
