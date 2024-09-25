<?php

namespace App\Models\Admin\Transportation;

use App\Models\Admin\Car\Car;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];

    public function cars(){
        return $this->hasMany(Car::class);
    }
}
