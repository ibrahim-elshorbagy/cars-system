<?php

namespace App\Models\Admin\Transportation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = ['id'];

    public function models(){
        return $this->hasMany(Modell::class);
    }
}
