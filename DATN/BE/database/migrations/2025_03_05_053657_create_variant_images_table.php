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
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Khóa ngoại đúng chuẩn
            $table->string('image_url');
            $table->timestamps();
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
