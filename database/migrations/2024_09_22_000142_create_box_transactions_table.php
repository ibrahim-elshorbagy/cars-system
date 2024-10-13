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
        Schema::create('box_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('box_id')->constrained('boxes');
            $table->decimal('income', 10, 2)->default(0.00);
            $table->decimal('outcome', 10, 2)->default(0.00);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('box_transactions');
    }
};
