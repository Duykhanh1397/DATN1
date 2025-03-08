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

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'name'];

    // Liên kết đến bảng variant_values
    public function variantValues()
    {
        return $this->hasMany(VariantValue::class, 'variant_id');
    }
}
