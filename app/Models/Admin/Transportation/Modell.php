<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modell extends Model
{
    use HasFactory;
    protected $table = 'models';
    public $timestamps = false;
    protected $guarded = ['id'];


    public function make(){
        return $this->belongsTo(Make::class, 'make_id', 'id');
    }

}
