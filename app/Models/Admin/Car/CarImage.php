<?php

namespace App\Models\Admin\Car;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarImage extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];
}
