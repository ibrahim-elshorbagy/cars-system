<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Admin\Car\Car;

class Facility extends Model
{
    use HasFactory;
    protected $table = 'facilities';
    public $timestamps = false;
    protected $guarded = ['id'];
        public function cars(){
        return $this->hasMany(Car::class);
    }
}
