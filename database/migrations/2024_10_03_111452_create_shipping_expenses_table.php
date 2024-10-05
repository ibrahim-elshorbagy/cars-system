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
        Schema::create('shipping_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->references('id')->on('bills')->onDelete('cascade');
            $table->foreignId('shipping_fee_type_id')->references('id')->on('shipping_fee_types')->onDelete('cascade');
            $table->decimal('amount', 10, 2);

            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_expenses');
    }
};
