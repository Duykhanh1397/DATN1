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
        Schema::create('variant_color', function (Blueprint $table) {
            $table->id();
            $table->string('value')->unique(); // Màu sắc (VD: Đỏ, Đen, Xanh)
            $table->timestamps();
            $table->softDeletes(); // Hỗ trợ xóa mềm nếu cần
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_color');
    }
};
