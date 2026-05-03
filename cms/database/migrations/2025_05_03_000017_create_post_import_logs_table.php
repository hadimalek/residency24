<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_import_logs', function (Blueprint $table) {
            $table->id();
            // One UUID per import run — groups all rows from a single batch
            $table->uuid('batch_id');
            $table->string('source', 32);                   // wp
            $table->string('source_id', 64);                // WP post ID
            $table->string('source_url', 512)->nullable();  // original WP URL
            $table->string('lang', 8);
            $table->unsignedBigInteger('post_id')->nullable(); // populated on success
            // success | skipped_duplicate | failed
            $table->string('status', 20);
            $table->text('error')->nullable();
            // SHA-256 of the raw import payload — re-imports with same hash are skipped
            $table->char('payload_hash', 64)->nullable();
            $table->timestamp('started_at');
            $table->timestamp('finished_at')->nullable();

            // Idempotency: same source post + language cannot be logged twice as success
            $table->unique(['source', 'source_id', 'lang'], 'pil_source_unique');
            $table->index('batch_id');
            $table->index('status');
            $table->index('post_id');

            $table->foreign('lang')->references('code')->on('languages');
            $table->foreign('post_id')->references('id')->on('posts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_import_logs');
    }
};
