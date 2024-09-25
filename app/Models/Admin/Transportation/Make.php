<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Admin\Car\Car;

class Make extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];

    public function models(){
        return $this->hasMany(Modell::class);
    }

    public function cars(){
        return $this->hasMany(Car::class);
    }
}
