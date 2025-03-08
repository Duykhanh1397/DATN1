<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Order extends Model
// {
//     use HasFactory;

//     protected $fillable = ['user_id', 'voucher_id', 'order_code', 'status', 'total_amount', 'phone_number', 'address'];

//     public function user()
//     {
//         return $this->belongsTo(User::class);
//     }

//     public function orderItems()
//     {
//         return $this->hasMany(OrderItem::class);
//     }

//     public function payment()
//     {
//         return $this->hasOne(Payment::class);
//     }

//     public function voucher()
//     {
//         return $this->belongsTo(Voucher::class);
//     }
// }




// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Order extends Model
// {
//     use HasFactory;

//     protected $fillable = [
//         'user_id',
//         'guest_user', // Thêm trường guest_user để lưu thông tin khách hàng tạm thời
//         'voucher_id',
//         'order_code',
//         'status',
//         'total_amount',
//         'phone_number',
//         'address',
//     ];

//     public function user()
//     {
//         return $this->belongsTo(User::class);
//     }

//     public function orderItems()
//     {
//         return $this->hasMany(OrderItem::class);
//     }

//     public function voucher()
//     {
//         return $this->belongsTo(Voucher::class);
//     }
//     public function payment()
//         {
//             return $this->hasOne(Payment::class);
//         }
// }



// <?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'guest_user', 'voucher_id', 'order_code', 'status',
        'total_amount', 'phone_number', 'address', 'payment_method', 'payment_status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Scope: Lọc đơn hàng theo trạng thái
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Lấy tổng số lượng sản phẩm trong đơn hàng
        */
    public function getTotalQuantityAttribute()
    {
        return $this->orderItems->sum('quantity');
    }
}
