<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'user_id', 'status', 'note' // 🔹 Thêm cột `note` để lưu ghi chú khi thay đổi trạng thái
    ];

    protected $casts = [
        'updated_at' => 'datetime', // 🔹 Chuyển đổi `updated_at` thành kiểu datetime
    ];

    /**
     * 🔹 Quan hệ với bảng `orders`
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * 🔹 Quan hệ với bảng `users`
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 🔹 Scope: Lọc lịch sử theo đơn hàng
     */
    public function scopeByOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }

    /**
     * 🔹 Scope: Lọc lịch sử theo trạng thái cụ thể
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * 🔹 Trả về danh sách trạng thái đơn hàng dưới dạng mảng
     */
    public static function getStatusOptions()
    {
        return [
            'Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng',
            'Giao hàng thành công', 'Giao hàng thất bại', 'Hủy đơn'
        ];
    }
}
