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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // Khóa chính tự động
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // FK1
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // FK2
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // Đánh giá thuộc đơn hàng nào

            $table->integer('rating')->check('rating >= 1 AND rating <= 5'); // ⭐ Đảm bảo giá trị từ 1-5 sao
            $table->text('comment')->nullable(); // Bình luận của người dùng
            
            $table->enum('status', ['Hiển thị', 'Ẩn'])->default('Hiển thị'); // Trạng thái đánh giá

            $table->timestamp('created_at')->useCurrent(); // Thời gian tạo bình luận
            $table->softDeletes(); // Xóa mềm (deleted_at)

            // ✅ Thêm chỉ mục để tối ưu truy vấn
            $table->index(['product_id', 'user_id', 'rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
