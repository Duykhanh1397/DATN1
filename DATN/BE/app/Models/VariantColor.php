<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantColor extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'variant_color'; // Tên bảng đúng theo migration



    protected $fillable = [
        'value', // Màu sắc
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    // ✅ Quan hệ ngược về product_variants
    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class, 'color_id');
    }
}
