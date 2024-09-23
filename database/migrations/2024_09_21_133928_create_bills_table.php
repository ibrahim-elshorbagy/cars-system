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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained('cars');
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('type')->nullable(); //ship cost or won price
            $table->foreignId('box_id')->constrained('boxes');

            // Created and updated by
            // $table->foreignId('created_by')->constrained('users');
            // $table->foreignId('updated_by')->nullable()->constrained('users');

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
