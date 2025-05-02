<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reviews';

    protected $fillable = [
        'product_id',
        'product_variant_id', // Thêm product_variant_id vào fillable
        'user_id',
        'order_id',
        'rating',
        'comment',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ✅ Quan hệ với bảng `Product`
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // ✅ Quan hệ với bảng `ProductVariant`
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    // ✅ Quan hệ với bảng `Order`
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // ✅ Quan hệ với bảng `User`
    public function user()
    {
        return $this->belongsTo(User::class);
    }
     public function color()
    {
        return $this->belongsTo(VariantColor::class, 'color_id');
    }

    // ✅ Quan hệ với bảng `VariantStorage`
    public function storage()
    {
        return $this->belongsTo(VariantStorage::class, 'storage_id');
    }

    // ✅ Scope: Lọc các đánh giá hiển thị
    public function scopeVisible($query)
    {
        return $query->where('status', 'Hiển thị');
    }

    // ✅ Scope: Lọc đánh giá theo sản phẩm
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    // ✅ Scope: Lọc đánh giá theo biến thể sản phẩm
    public function scopeByProductVariant($query, $productVariantId)
    {
        return $query->where('product_variant_id', $productVariantId);
    }

    // ✅ Scope: Lọc đánh giá theo người dùng
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ✅ Scope: Lọc đánh giá theo đơn hàng
    public function scopeByOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }
}