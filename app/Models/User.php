<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Bill\PaymentBill;
use App\Models\Admin\Box\BoxTransaction;
use App\Models\Admin\Box\BoxTransfer;
use App\Models\Admin\Car\Car;
use App\Models\Admin\Customer\CustomerCredit;
use App\Models\Admin\Users\Accountant\Accountant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
// use Illuminate\Contracts\AuthfMustVerifyEmail;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    use HasRoles;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_photo_url',
        'phone',
        'whatsapp',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function accountant()
    {
        return $this->hasOne(Accountant::class, 'user_id');
    }

    public function credits(){

        return $this->hasMany(CustomerCredit::class, 'user_id');
    }

    public function bills(){

        return $this->hasMany(Bill::class, 'user_id');
    }

    public function paymentBills(){

        return $this->hasMany(PaymentBill::class, 'user_id');
    }

    public function createdBoxTransactions()
    {
        return $this->hasMany(BoxTransaction::class, 'created_by');
    }

    public function updatedBoxTransactions()
    {
        return $this->hasMany(BoxTransaction::class, 'updated_by');
    }

    public function createdCars()
    {
        return $this->hasMany(Car::class, 'created_by');
    }

    public function updatedCars()
    {
        return $this->hasMany(Car::class, 'updated_by');
    }

    public function createdCustomerCredits()
    {
        return $this->hasMany(CustomerCredit::class, 'created_by');
    }

    public function updatedCustomerCredits()
    {
        return $this->hasMany(CustomerCredit::class, 'updated_by');
    }

    public function createdBoxTransfers()
    {
        return $this->hasMany(BoxTransfer::class, 'created_by');
    }

    public function updatedBoxTransfers()
    {
        return $this->hasMany(BoxTransfer::class, 'updated_by');
    }
    public static function boot()
    {
        parent::boot();

    }


}
