<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id(); // Khóa chính
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Khóa ngoại đến bảng sản phẩm
            $table->foreignId('variant_value_id')->constrained('variant_values')->onDelete('cascade'); // Khóa ngoại đến giá trị biến thể
            $table->decimal('price', 10, 2)->default(0); // Giá của biến thể
            $table->integer('stock')->default(0); // Số lượng tồn kho
            $table->string('image')->nullable(); // Ảnh sản phẩm
            $table->timestamps();
            $table->softDeletes(); // Xóa mềm
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_variants');
    }
};

