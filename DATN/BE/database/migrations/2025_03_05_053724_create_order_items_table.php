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
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade'); // ✅ Thay thế variant_values
            $table->integer('quantity');
            $table->decimal('total_price', 12, 2);
            $table->timestamps();
    
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
