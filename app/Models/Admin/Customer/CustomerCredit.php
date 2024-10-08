<?php

namespace App\Models\Admin\Customer;

use App\Models\Admin\Box\Box;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerCredit extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function createdBy(){
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy(){
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function box(){

        return $this->belongsTo(Box::class, 'box_id');
    }
}
