<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->string('code', 8)->primary();          // en, fa, ar, ru
            $table->string('name', 64);                    // English, Persian …
            $table->string('native_name', 64);             // English, فارسی …
            $table->enum('direction', ['ltr', 'rtl'])->default('ltr');
            $table->boolean('is_default')->default(false); // exactly one row true
            $table->boolean('is_active')->default(true);
            $table->string('url_prefix', 8)->nullable();   // null for root (en), '/fa', '/ar', '/ru'
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
