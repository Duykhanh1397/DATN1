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
            $table->foreignId('variant_id')->constrained('variants')->onDelete('cascade'); // ✅ Khóa ngoại tham chiếu đến bảng 'variants'
            $table->string('value'); // ✅ Giá trị biến thể (ví dụ: Đỏ, Xanh, 128GB)
            $table->timestamps();
            $table->softDeletes(); // ✅ Xóa mềm
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

