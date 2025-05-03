<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantStorage extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'variant_storage'; // Tên bảng đúng theo migration


    protected $fillable = [
        'value', // Dung lượng: 64GB, 128GB, v.v.
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    // ✅ Quan hệ ngược về product_variants
    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class, 'storage_id');
    }
}
