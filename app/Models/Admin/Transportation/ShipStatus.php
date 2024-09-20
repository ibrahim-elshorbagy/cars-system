<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipStatus extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];
}
