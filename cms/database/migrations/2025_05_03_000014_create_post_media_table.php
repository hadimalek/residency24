<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_media', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('media_id');
            // inline | gallery | og | social
            $table->string('role', 32)->default('inline');
            $table->smallInteger('sort_order')->default(0);

            $table->primary(['post_id', 'media_id', 'role']);
            $table->index('media_id');

            $table->foreign('post_id')->references('id')->on('posts')->cascadeOnDelete();
            $table->foreign('media_id')->references('id')->on('media')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_media');
    }
};
