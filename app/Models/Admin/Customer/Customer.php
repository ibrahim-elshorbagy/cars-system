<?php

namespace App\Models\Admin\Customer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $primaryKey = 'user_id';
    public $timestamps = false;
    protected $guarded = [''];

}
