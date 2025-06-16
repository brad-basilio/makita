<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_points', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            
            // Type flag: 'distributor' or 'service_network'
            $table->enum('type', ['distributor', 'service_network'])->default('distributor');
            // Basic information
            $table->string('name')->nullable(); // ej: Sodimac Perú, Servicio Técnico Power Tools
            $table->string('business_name')->nullable(); // ej: Dismac Perú Sociedad Anónima Cerrada
            $table->text('address')->nullable();
            $table->text('phones')->nullable();
            $table->text('emails')->nullable();
            // Schedule
            $table->text('opening_hours')->nullable(); // Monday to Friday hours
            // Map location
            $table->text('location')->nullable();
            // Branches as JSON
            $table->json('branches')->nullable(); // Array of branch objects with same structure
            // Status
            $table->boolean('status')->default(true);
            $table->boolean('visible')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_points');
    }
};
