<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class CartItem extends Model
// {
//     use HasFactory;

//     protected $fillable = ['cart_id', 'variant_id', 'quantity', 'total_price'];

//     /**
//      * Một mục giỏ hàng thuộc về một giỏ hàng
//      */
//     public function cart()
//     {
//         return $this->belongsTo(Cart::class);
//     }

//     /**
//      * Một mục giỏ hàng thuộc về một biến thể sản phẩm
//      */
//     public function variant()
//     {
//         return $this->belongsTo(ProductVariant::class);
//     }
// }





namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',          // Liên kết giỏ hàng
        'product_variant_id', // Liên kết với product_variants
        'quantity',         // Số lượng sản phẩm trong giỏ
        'total_price'       // Tổng tiền của mục giỏ hàng
    ];

    protected $casts = [
        'quantity'    => 'integer',
        'total_price' => 'float',
    ];

    /**
     * 📌 Quan hệ với bảng `product_variants`
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * 📌 Quan hệ với bảng `carts`
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    /**
     * 📌 Scope: Lọc danh sách mục giỏ hàng theo `cart_id`
     */
    public function scopeByCart($query, $cartId)
    {
        return $query->where('cart_id', $cartId);
    }

    /**
     * 📌 Tính toán tổng giá của `cart_item`
     */
    public function calculateTotalPrice()
    {
        if ($this->productVariant) {
            $this->total_price = $this->quantity * $this->productVariant->price;
            $this->save();
        }
    }
}
