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

    protected $fillable = ['cart_id', 'value_id', 'quantity', 'total_price'];

    // Liên kết đến bảng variant_values
    public function variantValue()
    {
        return $this->belongsTo(VariantValue::class, 'value_id');
    }

    // Liên kết đến bảng carts
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    // * Scope: Lọc theo giỏ hàng cụ thể
    // */
   public function scopeByCart($query, $cartId)
   {
       return $query->where('cart_id', $cartId);
   }
}


