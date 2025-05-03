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
        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id(); // ID tự động tăng
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // Liên kết với đơn hàng
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Người cập nhật
            $table->enum('status', [
                'Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng',
                'Giao hàng thành công', 'Giao hàng thất bại', 'Hủy đơn'
            ])->default('Chờ xác nhận'); // Trạng thái đơn hàng
            $table->text('note')->nullable(); // Ghi chú lý do
            $table->timestamps(); // ✅ BẮT BUỘC: Tạo `created_at` và `updated_at`
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
    }
};
