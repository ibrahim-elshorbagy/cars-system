<?php

namespace App\Models\Admin\Car;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarImage extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];

    public function createdBy()
    {
        return $this->belongsTo(User::class,'created_by');
    }
}
