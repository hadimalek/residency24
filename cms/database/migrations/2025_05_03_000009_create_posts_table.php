<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // ── Identity ──────────────────────────────────────────────
            $table->string('lang', 8);
            $table->unsignedBigInteger('translation_group_id')->nullable();

            // ── Classification ────────────────────────────────────────
            $table->string('type', 32)->default('post');    // post | guide | news | case_study
            $table->string('status', 20)->default('draft'); // draft | scheduled | published | archived

            // ── Content ───────────────────────────────────────────────
            $table->string('title', 255);
            $table->string('slug', 255);
            $table->text('excerpt')->nullable();
            $table->longText('content_html');
            $table->json('content_json')->nullable();       // editor source (TipTap / Lexical / blocks)
            $table->smallInteger('reading_time_minutes')->nullable();

            // ── Relations ─────────────────────────────────────────────
            $table->unsignedBigInteger('author_id')->nullable();
            $table->unsignedBigInteger('featured_image_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();

            // ── SEO / URL ─────────────────────────────────────────────
            $table->string('canonical_url', 512)->nullable(); // overridden by post_seo.canonical_url if set
            $table->string('old_url', 512)->nullable();       // provenance — original WP URL

            // ── Import / Source ───────────────────────────────────────
            $table->string('source', 32)->nullable();         // wp | manual | import
            $table->string('source_id', 64)->nullable();      // original WP post ID

            // ── Dates ─────────────────────────────────────────────────
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // ── Indexes ───────────────────────────────────────────────
            // Primary listing query: posts per lang + status, ordered by date
            $table->index(['lang', 'status', 'published_at']);

            // Slug must be unique per language + content type
            $table->unique(['lang', 'type', 'slug'], 'posts_lang_type_slug_unique');

            // One post per language per translation group.
            // MySQL treats NULL as distinct in unique indexes, so standalone posts
            // (translation_group_id = NULL) never collide with each other.
            $table->unique(['translation_group_id', 'lang'], 'posts_group_lang_unique');

            // Deduplication for WordPress import (source + source_id + lang)
            $table->unique(['source', 'source_id', 'lang'], 'posts_source_unique');

            $table->index('type');
            $table->index('status');
            $table->index('author_id');
            $table->index('category_id');
            $table->index('old_url');

            // ── Foreign Keys ──────────────────────────────────────────
            $table->foreign('lang')->references('code')->on('languages');
            $table->foreign('translation_group_id')
                  ->references('id')->on('post_translation_groups')
                  ->nullOnDelete();
            $table->foreign('author_id')->references('id')->on('authors')->nullOnDelete();
            $table->foreign('featured_image_id')->references('id')->on('media')->nullOnDelete();
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
