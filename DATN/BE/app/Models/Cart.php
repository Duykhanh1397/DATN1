<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total_amount'];

    protected $casts = [
        'total_amount' => 'float',  // Ép kiểu giá trị tiền thành float
    ];

    /**
     * 📌 Một giỏ hàng có nhiều mục giỏ hàng (Cart Items)
     */
    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id');
    }

    /**
     * 📌 Một giỏ hàng thuộc về một người dùng
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 📌 Lấy tổng số lượng sản phẩm trong giỏ hàng
     */
    public function getTotalQuantityAttribute()
    {
        return $this->items->sum('quantity');
    }

    /**
     * 📌 Tính lại tổng tiền của giỏ hàng dựa trên tổng giá trị các sản phẩm trong giỏ
     */
    public function recalculateTotal()
    {
        $this->total_amount = $this->items->sum('total_price');
        $this->save();
    }

    /**
     * 📌 Scope: Lấy giỏ hàng đang hoạt động của một user
     */
    public function scopeActiveCart($query, $userId)
    {
        return $query->where('user_id', $userId)->latest();
    }
}
