<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_redirects', function (Blueprint $table) {
            $table->id();
            // Full path including language prefix: /fa/blog/old-slug, /blog/old-en-slug
            $table->string('from_path', 512)->unique();
            $table->string('to_path', 512);
            // Preferred when the destination is a known post
            $table->unsignedBigInteger('to_post_id')->nullable();
            $table->smallInteger('status_code')->default(301);
            // wp_import | slug_change | manual
            $table->string('source', 32)->default('manual');
            $table->unsignedBigInteger('hits')->default(0);
            $table->timestamp('last_hit_at')->nullable();
            $table->timestamps();

            $table->index('to_post_id');
            $table->foreign('to_post_id')->references('id')->on('posts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_redirects');
    }
};
