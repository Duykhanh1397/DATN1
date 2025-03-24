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
        'product_variant_id', // Liên kết với biến thể sản phẩm (không phải sản phẩm trực tiếp)
        'image_url'           // Đường dẫn ảnh
    ];

    protected $casts = [
        'deleted_at' => 'datetime', // Xử lý ngày xóa mềm
    ];

    // ✅ Quan hệ với `ProductVariant`
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id'); // Liên kết với product_variant
    }

    // ✅ Scope: Lọc ảnh theo biến thể sản phẩm (product_variant)
    public function scopeByProductVariant($query, $productVariantId)
    {
        return $query->where('product_variant_id', $productVariantId); // Lọc theo biến thể sản phẩm
    }

    protected $appends = ['image_url'];

public function getImageUrlAttribute($value)
{
    return asset('storage/' . $this->attributes['image_url']);
}


}
