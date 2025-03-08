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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Sử dụng id() tự động tạo khóa chính là 'id'
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Liên kết với bảng users
            $table->string('guest_user')->nullable(); // Thêm trường guest_user để lưu thông tin tạm thời
            $table->foreignId('voucher_id')->nullable()->constrained('vouchers')->onDelete('set null'); // Liên kết với bảng vouchers (nếu có)
            $table->string('order_code')->unique();
            $table->enum('status', ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Giao hàng thành công', 'Giao hàng thất bại', 'Hủy đơn'])->default('Chờ xác nhận'); // Trạng thái đơn hàng
            $table->decimal('total_amount', 12, 2); // Tổng số tiền
            $table->string('phone_number');
            $table->string('address');
            $table->enum('payment_method', ['COD', 'VNPay'])->default('COD'); // Phương thức thanh toán
            $table->enum('payment_status', ['Chờ thanh toán', 'Thanh toán thành công', 'Thanh toán thất bại'])->default('Chờ thanh toán');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
