<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Bill\PaymentBill;
use App\Models\Admin\Customer\CustomerCredit;
use App\Models\Admin\Users\Accountant\Accountant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
// use Illuminate\Contracts\Auth\MustVerifyEmail;

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

    // public function payments()
    // {
    //     return $this->hasManyThrough(PaymentBill::class, Bill::class);
    // }

    public static function boot()
    {
        parent::boot();

    }


}
