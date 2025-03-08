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
        Schema::create('variant_values', function (Blueprint $table) {
            $table->id(); // Laravel tự động tạo khóa chính 'id'
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade'); // Khóa ngoại đúng chuẩn
            $table->string('image_url')->nullable();
            $table->integer('stock')->default(10);
            $table->decimal('price', 12, 2);
            $table->string('color_name')->nullable();
            $table->string('storage_size')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Xóa mềm
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_values');
    }
};
