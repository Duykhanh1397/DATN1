<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categories'; // Xác định tên bảng

    protected $fillable = ['name', 'description', 'status'];

    protected $casts = [
        'deleted_at' => 'datetime', // Chuyển deleted_at thành Carbon datetime
    ];

    // ✅ Đặt giá trị mặc định nếu chưa có
    protected $attributes = [
        'status' => 'Hoạt động',
    ];

    // ✅ Quan hệ với Product
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id'); // Chuẩn khóa chính (id)
    }
}

