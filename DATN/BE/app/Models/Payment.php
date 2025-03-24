<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_date',
        'amount',
        'payment_method',
        'payment_status'
    ];

    /**
     * Quan hệ: Một thanh toán thuộc về một đơn hàng
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scope: Lọc các thanh toán thành công
     */
    public function scopeSuccessful($query)
    {
        return $query->where('payment_status', 'Thanh toán thành công');
    }

    /**
     * Scope: Lọc thanh toán theo phương thức thanh toán
     */
    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Truy vấn các thanh toán đang chờ xử lý
     */
    public function scopePending($query)
    {
        return $query->where('payment_status', 'Chờ thanh toán');
    }

    /**
     * Xử lý `payment_date` thành kiểu ngày giờ nếu chưa có
     */
    protected function paymentDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? date('d-m-Y H:i:s', strtotime($value)) : null
        );
    }
}
