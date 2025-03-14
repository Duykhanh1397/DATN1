<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'variant_images'; // Xác định đúng bảng

    protected $fillable = [
        'product_id',  // Liên kết sản phẩm
        'image_url'    // Đường dẫn ảnh
    ];

    protected $casts = [
        'deleted_at' => 'datetime', // Xử lý ngày xóa mềm
    ];

    // ✅ Quan hệ với `products`
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // ✅ Scope: Lọc ảnh theo sản phẩm
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }
}
