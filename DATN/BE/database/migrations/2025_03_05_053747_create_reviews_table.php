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
            $table->id(); // Tạo cột id mặc định làm khóa chính (PK)
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // FK1
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // FK2
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // FK3
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamp('created_at')->useCurrent(); // Thời gian tạo bình luận
    
            // Các khóa ngoại đã được xử lý trong các phương thức `constrained`
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
