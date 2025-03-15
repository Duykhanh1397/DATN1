<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id(); // Khóa chính
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // FK tới sản phẩm

            $table->json('variant_value_ids'); // Lưu danh sách ID biến thể (màu, dung lượng,...)

            $table->decimal('price', 10, 2)->default(0); // Giá
            $table->integer('stock')->default(0); // Số lượng tồn kho
            $table->string('image')->nullable(); // Ảnh biến thể

            $table->timestamps();
            $table->softDeletes(); // Xóa mềm
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_variants');
    }
};