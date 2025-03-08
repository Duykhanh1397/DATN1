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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id(); // Sử dụng id mặc định làm khóa chính (PK)
            $table->foreignId('value_id')->constrained('variant_values')->onDelete('cascade'); // FK1
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // FK2
            $table->integer('quantity'); // Số lượng sản phẩm trong đơn hàng
            $table->decimal('total_price', 12, 2); // Giá trị tổng cộng của sản phẩm (quantity * price)
            $table->timestamps(); // Các cột created_at và updated_at
    
            // Các khóa ngoại đã được bao gồm trong phương thức `constrained()`
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
