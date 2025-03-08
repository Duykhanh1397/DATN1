<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total_amount'];

    /**
     * Một giỏ hàng có nhiều mục giỏ hàng
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Một giỏ hàng thuộc về một người dùng
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Lấy tổng số lượng sản phẩm trong giỏ hàng
     */
    public function getTotalQuantityAttribute()
    {
        return $this->items->sum('quantity');
    }
}
