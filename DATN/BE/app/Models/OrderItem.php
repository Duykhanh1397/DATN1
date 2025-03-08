<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'value_id', 'quantity', 'total_price'];

    /**
     * Một mục trong đơn hàng thuộc về một đơn hàng
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Một mục trong đơn hàng thuộc về một giá trị biến thể (VariantValue)
     */
    public function variantValue()
    {
        return $this->belongsTo(VariantValue::class, 'value_id');
    }

    /**
     * Lấy tổng giá trị của sản phẩm trong đơn hàng
     */
    public function getTotalPriceAttribute()
    {
        return $this->quantity * ($this->variantValue->price ?? 0);
    }
}
