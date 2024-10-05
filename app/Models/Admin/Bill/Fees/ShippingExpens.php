<?php

namespace App\Models\Admin\Bill\Fees;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingExpens extends Model
{
    protected $table = 'shipping_expenses';
    use HasFactory;
    protected $guarded = ['id'];

    public function shippingFeeType()
    {
        return $this->belongsTo(ShippingFeeType::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship to the User who last updated the expense
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
