<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

// class Voucher extends Model
// {
//     use SoftDeletes;

//     protected $table = 'vouchers'; // Tên bảng

//     protected $primaryKey = 'voucher_id'; // Khóa chính

//     protected $fillable = [
//         'code', 
//         'discount_type', 
//         'discount_value', 
//         'start_date', 
//         'end_date', 
//         'usage_limit', 
//         'min_order_value'
//     ];

//     protected $dates = ['deleted_at']; // Sử dụng cho xóa mềm

//     public function isValid()
//     {
//         $now = now();
//         return $now->between($this->start_date, $this->end_date) && $this->usage_limit > 0;
//     }

//     public function decrementUsage()
//     {
//         if ($this->usage_limit > 0) {
//             $this->usage_limit--;
//             $this->save();
//         }
//     }

//     public function isApplicable($orderValue)
//     {
//         return $orderValue >= $this->min_order_value;
//     }

//     public function calculateDiscount($orderValue)
//     {
//         if ($this->discount_type == 'percentage') {
//             return $orderValue * ($this->discount_value / 100);
//         } elseif ($this->discount_type == 'fixed') {
//             return $this->discount_value;
//         }
//         return 0;
//     }

//     public function scopeValid($query)
//     {
//         $now = now();
//         return $query->where('start_date', '<=', $now)
//                      ->where('end_date', '>=', $now)
//                      ->where('usage_limit', '>', 0);
//     }

//     public function scopeExpiringSoon($query)
//     {
//         $now = now();
//         $nearFuture = $now->addDays(7);
//         return $query->where('end_date', '>=', $now)
//                      ->where('end_date', '<=', $nearFuture);
//     }
// }





namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_order_value',
        'max_discount',
        'usage_limit',
        'used_count',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'discount_value' => 'float',
        'min_order_value' => 'float',
        'max_discount' => 'float',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    // Quan hệ với bảng voucher_user
    public function users()
    {
        return $this->belongsToMany(User::class, 'voucher_user')
                    ->withPivot('used_at')
                    ->withTimestamps();
    }

    public function isValid()
    {
        $now = Carbon::now();

        return $this->status === 'Hoạt động'
            && $this->used_count < $this->usage_limit
            && (!$this->start_date || $this->start_date->isBefore($now))
            && (!$this->end_date || $this->end_date->isAfter($now));
    }

    public function canApply($orderTotal)
    {
        return $this->isValid() && 
            (!$this->min_order_value || $orderTotal >= $this->min_order_value);
    }

    public function calculateDiscount($orderTotal)
    {
        if (!$this->canApply($orderTotal)) {
            return 0;
        }

        if ($this->discount_type === 'percentage') {
            $discount = ($orderTotal * $this->discount_value) / 100;
            if ($this->max_discount) {
                $discount = min($discount, $this->max_discount);
            }
            return min($discount, $orderTotal);
        }

        return min($this->discount_value, $orderTotal);
    }

    public function incrementUsage()
    {
        $this->increment('used_count');
        if ($this->used_count >= $this->usage_limit) {
            $this->update(['status' => 'Hết hạn']);
        }
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Hoạt động');
    }
}
