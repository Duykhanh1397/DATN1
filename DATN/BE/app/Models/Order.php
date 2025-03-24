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


// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Order extends Model
// {
//     use HasFactory;

//     protected $fillable = [
//         'user_id', 'guest_user', 'voucher_id', 'order_code', 'status',
//         'total_amount', 'phone_number', 'address', 'payment_method', 'payment_status'
//     ];

//     /**
//      * ✅ Quan hệ với User
//      */
//     public function user()
//     {
//         return $this->belongsTo(User::class);
//     }

//     /**
//      * ✅ Quan hệ với OrderItems
//      */
//     public function orderItems()
//     {
//         return $this->hasMany(OrderItem::class);
//     }

//     /**
//      * ✅ Quan hệ với Voucher
//      */
//     public function voucher()
//     {
//         return $this->belongsTo(Voucher::class);
//     }

//     /**
//      * ✅ Quan hệ với Payment (Một đơn hàng chỉ có một thanh toán)
//      */
//     public function payment()
//     {
//         return $this->hasOne(Payment::class);
//     }

//     /**
//      * ✅ Scope: Lọc đơn hàng theo một hoặc nhiều trạng thái
//      */
//     public function scopeStatus($query, $status)
//     {
//         if (is_array($status)) {
//             return $query->whereIn('status', $status);
//         }
//         return $query->where('status', $status);
//     }

//     /**
//      * ✅ Lấy tổng số lượng sản phẩm trong đơn hàng (Tối ưu hiệu suất)
//      */
//     public function getTotalQuantityAttribute()
//     {
//         return $this->order_items_count ?? 0; // Tránh n+1 queries bằng cách sử dụng `withCount('orderItems')`
//     }
// }










namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest_user',
        'voucher_id',
        'order_code',
        'status',
        'total_amount',
        'phone_number',
        'address',
        'payment_method',
        'payment_status'
    ];

    // ✅ Các trạng thái thanh toán, đơn hàng cố định để dùng cho validate hoặc hiển thị
    const STATUS = ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Giao hàng thành công', 'Giao hàng thất bại', 'Hủy đơn'];
    const PAYMENT_STATUS = ['Chờ thanh toán', 'Thanh toán thành công', 'Thanh toán thất bại'];
    const PAYMENT_METHOD = ['COD', 'VNPay'];

    /**
     * ✅ Quan hệ với User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ✅ Quan hệ với các Order Items
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * ✅ Quan hệ với Voucher
     */
    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    /**
     * ✅ Quan hệ với Payment (Một đơn hàng chỉ có một thanh toán)
     */
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * ✅ Scope: Lọc đơn theo trạng thái (hỗ trợ truyền mảng hoặc 1 status)
     */
    public function scopeStatus($query, $status)
    {
        return is_array($status) ? $query->whereIn('status', $status) : $query->where('status', $status);
    }

    /**
     * ✅ Tính tổng số lượng sản phẩm của đơn hàng (khi cần gọi gộp)
     */
    public function getTotalQuantityAttribute()
    {
        // Gọi withCount('orderItems') để tối ưu SQL
        return $this->order_items_count ?? $this->orderItems()->sum('quantity');
    }

    /**
     * ✅ Hiển thị đúng thông tin khách đặt (User hoặc Guest)
     */
    public function getCustomerNameAttribute()
    {
        return $this->user ? $this->user->name : $this->guest_user;
    }
}
