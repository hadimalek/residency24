<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 8);
            $table->unsignedBigInteger('translation_group_id')->nullable();
            $table->string('name', 160);
            $table->string('slug', 160);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['lang', 'slug']);
            $table->index('lang');

            $table->foreign('lang')->references('code')->on('languages');
            $table->foreign('translation_group_id')
                  ->references('id')->on('tag_translation_groups')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
