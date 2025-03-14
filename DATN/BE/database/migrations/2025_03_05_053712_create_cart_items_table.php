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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id(); // ID cart item
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade'); // Liên kết với carts
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade'); // Liên kết với product_variants
            $table->integer('quantity')->default(1); // Số lượng
            $table->decimal('total_price', 12, 2)->default(0); // Tổng giá trị mặt hàng
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
