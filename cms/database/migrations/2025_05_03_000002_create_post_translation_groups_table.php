<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_translation_groups', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();             // stable external ID for hreflang
            // x_default_lang resolved at query time; nullable = fall back to default language post
            $table->string('x_default_lang', 8)->nullable();
            $table->text('notes')->nullable();          // internal admin notes
            $table->timestamps();

            $table->foreign('x_default_lang')
                  ->references('code')->on('languages')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_translation_groups');
    }
};
