<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantValue extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'variant_values'; // Xác định đúng bảng

    protected $fillable = [
        'variant_id', // ✅ Khóa ngoại tham chiếu đến bảng `variants`
        'value' // ✅ Giá trị biến thể (ví dụ: Đỏ, Xanh, 128GB) 
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    // ✅ Quan hệ với bảng `variants`
    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class, 'variant_value_id');
    }

    // ✅ Quan hệ với bảng `variants` (Mô tả loại biến thể)
    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }
}
