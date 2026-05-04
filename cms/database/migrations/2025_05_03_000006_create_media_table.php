<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('disk', 32)->default('local');   // local | s3 | cdn
            $table->string('path', 512);
            $table->string('original_filename', 255);
            $table->string('mime_type', 96);
            $table->unsignedBigInteger('size_bytes');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->char('hash_sha256', 64)->nullable();    // deduplication key
            $table->string('source_url', 512)->nullable();  // original URL when imported from WP
            $table->timestamps();

            $table->index('hash_sha256');
            $table->index('mime_type');
        });

        // Language-specific alt text and captions stored separately
        Schema::create('media_translations', function (Blueprint $table) {
            $table->unsignedBigInteger('media_id');
            $table->string('lang', 8);
            $table->string('alt_text', 255)->nullable();
            $table->text('caption')->nullable();

            $table->primary(['media_id', 'lang']);
            $table->foreign('media_id')->references('id')->on('media')->cascadeOnDelete();
            $table->foreign('lang')->references('code')->on('languages')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_translations');
        Schema::dropIfExists('media');
    }
};
