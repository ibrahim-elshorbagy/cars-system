<?php

namespace App\Models\Admin\Bill;

use App\Models\Admin\Box\Box;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function customer(){
        return $this->belongsTo(User::class, 'user_id');
    }


    public function createdBy(){
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(){
        return $this->belongsTo(User::class, 'updated_by');
    }


    public function paymentBills(){
        return $this->hasMany(PaymentBill::class);
    }
}
