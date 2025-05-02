<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Spatie\Permission\Traits\HasRoles;
class User extends Authenticatable implements CanResetPasswordContract
{
    use HasApiTokens, HasFactory, Notifiable;
    use SoftDeletes; // Kích hoạt xóa mềm
    use CanResetPassword;
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
        'role',
        'phone',
        'address',
        'status'
    ];



    public function hasRole($role)
    {
        // If $role is an array, check if the user's role is in the array
        if (is_array($role)) {
            return in_array($this->role, $role);
        }
    
        // If $role is a string, directly compare
        return $this->role === $role;
    }
    
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    protected $dates = ['deleted_at']; // Cột lưu timestamp khi xóa mềm 



    public function orders()
{
    return $this->hasMany(Order::class);
}


    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
