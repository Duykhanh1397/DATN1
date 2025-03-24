<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_variant_id',
        'quantity',
        'total_price'
    ];

    protected $casts = [
        'quantity'    => 'integer',
        'total_price' => 'float',
    ];

    /**
     * ✅ Một mục trong đơn hàng thuộc về một đơn hàng
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * ✅ Một mục trong đơn hàng thuộc về một biến thể sản phẩm (ProductVariant)
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * ✅ Accessor: Lấy tổng giá của mục đơn hàng dựa vào quantity và giá product_variant (nếu cần tính động)
     */
    public function getTotalPriceDynamicAttribute()
    {
        return $this->quantity * optional($this->productVariant)->price ?? 0;
    }
}
