<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id(); // Khóa chính

            // Liên kết tới sản phẩm
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            // Liên kết tới màu sắc
            $table->foreignId('color_id')->constrained('variant_color')->onDelete('cascade');

            // Liên kết tới dung lượng (storage)
            $table->foreignId('storage_id')->constrained('variant_storage')->onDelete('cascade');

            // Giá và tồn kho của từng biến thể
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('stock')->default(0);

          

            $table->timestamps();
            $table->softDeletes(); // Xóa mềm
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_variants');
    }
};






