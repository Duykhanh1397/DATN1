<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_variants'; // Xác định tên bảng

    protected $fillable = [
        'product_id',      // Liên kết với sản phẩm
        'color_id',        // Liên kết với màu sắc
        'storage_id',      // Liên kết với dung lượng
        'price',           // Giá của biến thể
        'stock',           // Số lượng tồn kho
    ];

    protected $casts = [
        'deleted_at' => 'datetime', // Chuyển đổi deleted_at thành datetime
    ];

    // ✅ Quan hệ với bảng `Product`
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // ✅ Quan hệ với bảng `VariantColor`
    public function color()
    {
        return $this->belongsTo(VariantColor::class, 'color_id');
    }

    // ✅ Quan hệ với bảng `VariantStorage`
    public function storage()
    {
        return $this->belongsTo(VariantStorage::class, 'storage_id');
    }

    // ✅ Quan hệ với bảng `VariantImage` (để lấy hình ảnh của biến thể)
    public function images()
    {
        return $this->hasMany(VariantImage::class, 'product_variant_id');
    }

    // ✅ Scope: Lọc biến thể theo sản phẩm cụ thể
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }
}







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