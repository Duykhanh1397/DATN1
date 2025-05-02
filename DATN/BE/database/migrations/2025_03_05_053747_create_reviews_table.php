<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // Khóa chính tự động
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // FK1: Liên kết với sản phẩm
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('cascade'); // FK2: Liên kết với biến thể (nullable)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // FK3: Liên kết với người dùng
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // FK4: Liên kết với đơn hàng

            $table->integer('rating')->check('rating >= 1 AND rating <= 5'); // Đảm bảo giá trị từ 1-5 sao
            $table->text('comment')->nullable(); // Bình luận của người dùng
            
            $table->enum('status', ['Hiển thị', 'Ẩn'])->default('Hiển thị'); // Trạng thái đánh giá

            $table->timestamps(); // Thời gian tạo và cập nhật
            $table->softDeletes(); // Xóa mềm (deleted_at)

            // Thêm chỉ mục để tối ưu truy vấn
            $table->index(['product_id', 'product_variant_id', 'user_id', 'rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
}
