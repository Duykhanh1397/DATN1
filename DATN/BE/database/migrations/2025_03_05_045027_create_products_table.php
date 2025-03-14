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
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Laravel tự động tạo khóa chính với tên 'id'
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); // Khóa ngoại tham chiếu đến categories
            $table->string('name')->unique(); // Đảm bảo tên sản phẩm không trùng lặp
            $table->text('description')->nullable();
            $table->enum('status', ['Hoạt động', 'Ngừng hoạt động'])->default('Hoạt động'); // ENUM status
            $table->timestamps();
            $table->softDeletes(); // Xóa mềm (deleted_at)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};