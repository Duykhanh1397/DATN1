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
            $table->id(); // Laravel tự động tạo khóa chính `id`
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade'); // Khóa ngoại liên kết với carts
            $table->foreignId('value_id')->constrained('variant_values')->onDelete('cascade'); // Khóa ngoại liên kết với product_variants
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 12, 2);
            $table->timestamps(); // Tạo created_at & updated_at
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
