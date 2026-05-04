<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_ctas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            // lead_form | whatsapp | internal_link | service
            $table->string('type', 32);
            $table->string('title', 255);
            $table->text('body')->nullable();
            $table->string('button_label', 120)->nullable();
            $table->string('target_url', 512)->nullable();
            // Matches SharedLeadForm.serviceContext in the Next.js frontend
            $table->string('service_context', 64)->nullable();
            // top | mid | bottom | sidebar
            $table->string('placement', 32)->default('bottom');
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['post_id', 'placement']);
            $table->foreign('post_id')->references('id')->on('posts')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_ctas');
    }
};
