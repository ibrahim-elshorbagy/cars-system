<?php

namespace App\Models\Admin\Car;

use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Transportation\Destination;
use App\Models\Admin\Transportation\Facility;
use App\Models\Admin\Transportation\Line;
use App\Models\Admin\Transportation\Make;
use App\Models\Admin\Transportation\Modell;
use App\Models\Admin\Transportation\Terminal;
use App\Models\Admin\Transportation\Vendor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function line()
    {
        return $this->belongsTo(Line::class);
    }

    public function terminal()
    {
        return $this->belongsTo(Terminal::class);
    }

    public function make()
    {
        return $this->belongsTo(Make::class);
    }

    public function model()
    {
        return $this->belongsTo(Modell::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function carImages()
    {
        return $this->hasMany(CarImage::class);
    }

    public function bill(){
        return $this->hasOne(Bill::class);
    }

    public function createdBy(){
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy(){
        return $this->belongsTo(User::class, 'updated_by');
    }
}
