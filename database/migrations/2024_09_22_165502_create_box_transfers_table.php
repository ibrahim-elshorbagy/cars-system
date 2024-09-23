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
        Schema::create('box_transfers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('from_box_id')->constrained('boxes');
                $table->foreignId('to_box_id')->constrained('boxes');
                $table->decimal('amount', 10, 2);

                // // Created and updated by
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
        Schema::dropIfExists('box_transfers');
    }
};