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
        Schema::create('variant_images', function (Blueprint $table) {
            $table->id(); // Laravel tự động tạo khóa chính 'id'
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade'); // Khóa ngoại liên kết với bảng product_variants
            $table->string('image_url'); // Đường dẫn hình ảnh của biến thể sản phẩm
            $table->timestamps(); // Các trường thời gian
            $table->softDeletes(); // Xóa mềm
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_images');
    }
};
