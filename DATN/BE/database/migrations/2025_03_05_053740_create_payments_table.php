<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // Tự động tạo khóa chính là 'id'
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // Liên kết với bảng orders
            $table->dateTime('payment_date')->nullable(); // Ngày giờ thanh toán (có thể null nếu chưa thanh toán)
            $table->decimal('amount', 12, 2); // Số tiền thanh toán
            $table->enum('payment_method', ['COD', 'VNPay'])->default('COD'); // Chỉ hỗ trợ COD và VNPay, mặc định là COD
            $table->enum('payment_status', ['Chờ thanh toán', 'Thanh toán thành công', 'Thanh toán thất bại'])->default('Chờ thanh toán'); // Trạng thái thanh toán
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
