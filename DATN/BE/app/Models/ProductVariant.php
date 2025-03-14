<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

// class ProductVariant extends Model
// {
//     use SoftDeletes;

//     protected $primaryKey = 'variant_id';

//     protected $fillable = ['product_id', 'name'];

//     public function product()
//     {
//         return $this->belongsTo(Product::class, 'product_id');
//     }

//     public function values()
//     {
//         return $this->hasMany(VariantValue::class, 'variant_id');
//     }
// }




namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_variants'; // Xác định tên bảng

    protected $fillable = [
        'product_id',        // Liên kết sản phẩm
        'variant_value_id',  // Liên kết giá trị biến thể
        'price',             // Giá của biến thể
        'stock',             // Số lượng tồn kho
        'image',             // Ảnh biến thể (nếu có)
    ];

    protected $casts = [
        'deleted_at' => 'datetime', // Xử lý `deleted_at` thành kiểu datetime
    ];

    // ✅ Quan hệ với bảng `products`
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // ✅ Quan hệ với bảng `variant_values` (Dùng `variant_value_id` để kết nối)
    public function variantValue()
    {
        return $this->belongsTo(VariantValue::class, 'variant_value_id');
    }

    // ✅ Scope: Lọc biến thể theo sản phẩm cụ thể
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }
}


