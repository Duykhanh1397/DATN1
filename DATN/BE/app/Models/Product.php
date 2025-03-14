<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'products'; // Xác định tên bảng

    protected $fillable = ['category_id', 'name', 'description', 'status'];

    protected $casts = [
        'deleted_at' => 'datetime', // Chuyển deleted_at thành Carbon datetime
    ];

    // ✅ Đặt giá trị mặc định nếu chưa có
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            if (!$product->status) {
                $product->status = 'Hoạt động'; // Giá trị mặc định
            }
        });
    }

    // ✅ Quan hệ với bảng `categories`
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    // ✅ Quan hệ với `product_variants`
    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id', 'id');
    }

    // ✅ Quan hệ với `variant_images`
    public function images()
    {
        return $this->hasMany(VariantImage::class, 'product_id', 'id');
    }

    // ✅ Scope lọc sản phẩm đang hoạt động
    public function scopeActive($query)
    {
        return $query->where('status', 'Hoạt động');
    }
}
