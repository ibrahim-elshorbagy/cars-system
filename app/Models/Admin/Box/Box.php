<?php

namespace App\Models\Admin\Box;

use App\Models\Admin\Users\Accountant\Accountant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Box extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function transactions(){
        return $this->hasMany(BoxTransaction::class);
    }
    public function fromTransfers()
    {
        return $this->hasMany(BoxTransfer::class, 'from_box_id');
    }

    // Relationship for transfers where the box is the 'to' box
    public function toTransfers()
    {
        return $this->hasMany(BoxTransfer::class, 'to_box_id');
    }

    public function accountants()
    {
        return $this->hasMany(Accountant::class);
    }

}

