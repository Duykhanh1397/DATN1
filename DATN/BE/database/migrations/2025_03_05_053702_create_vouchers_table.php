<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã voucher
            $table->enum('discount_type', ['percentage', 'fixed']); // Loại giảm giá theo phần trăm hay theo giá
            $table->decimal('discount_value', 12, 2); // Giá trị giảm giá
            $table->decimal('min_order_value', 12, 2)->nullable(); // Giá trị đơn hàng tối thiểu
            $table->decimal('max_discount', 12, 2)->nullable(); // Giảm giá tối đa (cho phần trăm)
            $table->integer('usage_limit')->default(1); // Số lần sử dụng tối đa
            $table->integer('used_count')->default(0); // Số lần đã sử dụng
            $table->dateTime('start_date')->nullable(); // Ngày bắt đầu áp dụng
            $table->dateTime('end_date')->nullable(); // Ngày hết hạn
            $table->enum('status', ['Hoạt động', 'Ngưng hoạt động', 'Hết hạn'])->default('Hoạt động'); // Trạng thái
            $table->softDeletes(); // Thêm cột deleted_at để hỗ trợ xóa mềm
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
