<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_seo', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id')->primary();

            // ── Basic SEO ─────────────────────────────────────────────
            $table->string('meta_title', 255)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->string('meta_keywords', 512)->nullable();      // legacy; optional
            $table->string('robots', 64)->default('index,follow');
            $table->string('canonical_url', 512)->nullable();      // highest-priority canonical override

            // ── Open Graph ────────────────────────────────────────────
            $table->string('og_title', 255)->nullable();
            $table->text('og_description')->nullable();
            $table->unsignedBigInteger('og_image_id')->nullable();
            $table->string('og_type', 32)->default('article');

            // ── Twitter / X Card ──────────────────────────────────────
            $table->string('twitter_card', 32)->default('summary_large_image');
            $table->string('twitter_title', 255)->nullable();
            $table->text('twitter_description')->nullable();
            $table->unsignedBigInteger('twitter_image_id')->nullable();

            // ── Structured Data ───────────────────────────────────────
            $table->json('schema_json')->nullable();                // full JSON-LD override (ready to embed)
            $table->json('breadcrumbs_json')->nullable();

            // ── Import Provenance ─────────────────────────────────────
            $table->string('imported_from', 32)->nullable();       // rankmath | yoast
            $table->json('imported_payload')->nullable();           // raw snapshot for reference

            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('posts')->cascadeOnDelete();
            $table->foreign('og_image_id')->references('id')->on('media')->nullOnDelete();
            $table->foreign('twitter_image_id')->references('id')->on('media')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_seo');
    }
};
