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
        Schema::create('variant_storage', function (Blueprint $table) {
            $table->id();
            $table->string('value')->unique(); // Dung lượng (VD: 64GB, 128GB, 256GB)
            $table->timestamps();
            $table->softDeletes(); // Hỗ trợ xóa mềm nếu cần
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_storage');
    }
};
