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
        Schema::create('cars', function (Blueprint $table) {
                $table->id();
                $table->boolean('keys')->nullable();
                $table->boolean('title')->nullable();
                $table->string('bookingNo')->nullable();
                $table->string('container_number')->nullable();
                $table->string('lot')->nullable();
                $table->string('color')->nullable();
                $table->string('year')->nullable();
                $table->string('chassis')->nullable();

                // Foreign keys
                $table->foreignId('user_id')->constrained('users');
                $table->foreignId('destination_id')->nullable()->constrained('destinations');
                $table->foreignId('vendor_id')->nullable()->constrained('vendors');
                $table->foreignId('terminal_id')->nullable()->constrained('terminals');
                $table->foreignId('line_id')->nullable()->constrained('lines');
                $table->foreignId('facility_id')->nullable()->constrained('facilities');
                $table->foreignId('make_id')->nullable()->constrained('makes');
                $table->foreignId('model_id')->nullable()->constrained('models');

                $table->string('carfax_report')->nullable();
                $table->string('ship_status')->nullable();
                $table->date('date_won')->nullable();
                $table->date('estimate_arrival_date')->nullable();
                $table->date('arrival_date')->nullable();

                $table->foreignId('created_by')->constrained('users');
                $table->foreignId('updated_by')->nullable()->constrained('users');

                $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
