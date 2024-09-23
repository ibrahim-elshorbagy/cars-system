<?php

namespace App\Models\Admin\Box;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Box extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function transactions(){
        return $this->hasMany(BoxTransaction::class);
    }
    public function transfers(){
        return $this->hasMany(BoxTransfer::class);
    }

}

