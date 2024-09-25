<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Admin\Car\Car;

class Modell extends Model
{
    use HasFactory;
    protected $table = 'models';
    public $timestamps = false;
    protected $guarded = ['id'];


    public function make(){
        return $this->belongsTo(Make::class, 'make_id', 'id');
    }

        public function cars(){
        return $this->hasMany(Car::class,'model_id','id');
    }

}
