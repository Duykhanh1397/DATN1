<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Variant extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'variants'; // Đặt tên bảng chính xác

    protected $fillable = [
        'name' // ✅ Loại biến thể (ví dụ: Màu sắc, Dung lượng)
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    // ✅ Quan hệ với bảng `variant_values`
    public function variantValues()
    {
        return $this->hasMany(VariantValue::class, 'variant_id');
    }
}
