<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 8);
            $table->unsignedBigInteger('translation_group_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();           // tree per language
            $table->string('name', 160);
            $table->string('slug', 160);
            $table->text('description')->nullable();
            $table->string('seo_title', 255)->nullable();
            $table->text('seo_description')->nullable();
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['lang', 'slug']);
            $table->index('lang');
            $table->index('translation_group_id');

            $table->foreign('lang')->references('code')->on('languages');
            $table->foreign('translation_group_id')
                  ->references('id')->on('category_translation_groups')
                  ->nullOnDelete();
            $table->foreign('parent_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
