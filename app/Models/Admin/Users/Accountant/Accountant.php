<?php

namespace App\Models\Admin\Users\Accountant;

use App\Models\Admin\Box\Box;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accountant extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $primaryKey = 'user_id';
    public $timestamps = false;
    protected $guarded = [''];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function box(){

        return $this->belongsTo(Box::class, 'user_id');
    }

}
