<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name'); // Nombre del usuario
            $table->string('email'); // Correo del usuario
            $table->string('phone')->nullable(); // Teléfono
            $table->string('dni')->nullable(); // DNI o identificación
            $table->string('type')->default('queja'); // Tipo de reclamo
            $table->date('incident_date')->nullable(); // Fecha del incidente
            $table->string('order_number')->nullable(); // Número de pedido o factura

            $table->string('priority')->default('media'); // Prioridad
            $table->text('description'); // Descripción del reclamo
            $table->json('file_paths')->nullable(); // Rutas de archivos adjuntos (JSON)
            $table->string('status')->default('pendiente'); // Estado del reclamo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
