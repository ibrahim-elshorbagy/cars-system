<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('car_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');
                $table->string('image_url');
                $table->timestamp('created_at')->nullable(); // Adds only created_at
                $table->foreignId('created_by')->references('id')->on('users')->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_images');
    }
};
