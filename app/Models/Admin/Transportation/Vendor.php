<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Admin\Car\Car;

class Vendor extends Model
{
    use HasFactory;
        public $timestamps = false;
    protected $guarded = ['id'];

        public function cars(){
        return $this->hasMany(Car::class);
    }
}
