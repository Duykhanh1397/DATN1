<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'order_id', // Thêm order_id để biết đánh giá thuộc đơn hàng nào
        'user_id',
        'rating',
        'comment',
        'status'
    ];

    protected $casts = [
        'deleted_at' => 'datetime', // Hỗ trợ xóa mềm
    ];

    /**
     * ✅ Quan hệ với sản phẩm
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * ✅ Quan hệ với đơn hàng (để biết đánh giá thuộc đơn hàng nào)
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * ✅ Quan hệ với người dùng (khách hàng đánh giá)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * ✅ Scope: Chỉ lấy đánh giá đang hiển thị
     */
    public function scopeVisible($query)
    {
        return $query->where('status', 'Hiển thị');
    }

    /**
     * ✅ Scope: Lọc đánh giá theo sản phẩm
     */
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * ✅ Scope: Lọc đánh giá theo khách hàng
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * ✅ Scope: Lọc đánh giá theo số sao
     */
    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * ✅ Event: Khi xóa mềm đánh giá, tự động cập nhật trạng thái về 'Ẩn'
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($review) {
            if ($review->isForceDeleting()) {
                // Nếu là xóa vĩnh viễn thì không làm gì cả
                return;
            }
            $review->update(['status' => 'Ẩn']);
        });
    }
}
