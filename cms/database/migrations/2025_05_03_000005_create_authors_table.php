<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 8);
            $table->unsignedBigInteger('translation_group_id')->nullable(); // optional shared identity across langs
            $table->unsignedBigInteger('user_id')->nullable();              // linked CMS admin user
            $table->unsignedBigInteger('avatar_media_id')->nullable();
            $table->string('name', 160);
            $table->string('slug', 160);
            $table->string('title', 160)->nullable();                       // e.g. "Senior Immigration Advisor"
            $table->text('bio')->nullable();
            $table->string('email', 255)->nullable();
            $table->string('twitter', 160)->nullable();
            $table->string('linkedin', 255)->nullable();
            $table->string('website', 255)->nullable();
            $table->timestamps();

            $table->unique(['lang', 'slug']);
            $table->index('lang');
            $table->index('user_id');

            $table->foreign('lang')->references('code')->on('languages');
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('authors');
    }
};
