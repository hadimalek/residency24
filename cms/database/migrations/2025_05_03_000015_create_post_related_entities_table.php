<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_related_entities', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id');
            // service | country | city | golden_visa_category | post
            $table->string('entity_type', 64);
            // slug or id of the entity
            $table->string('entity_key', 128);
            // related | pillar | cluster | cross_sell
            $table->string('relation', 32)->default('related');
            $table->smallInteger('sort_order')->default(0);

            $table->primary(['post_id', 'entity_type', 'entity_key', 'relation'], 'pre_primary');
            $table->index(['post_id', 'relation']);

            $table->foreign('post_id')->references('id')->on('posts')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_related_entities');
    }
};
