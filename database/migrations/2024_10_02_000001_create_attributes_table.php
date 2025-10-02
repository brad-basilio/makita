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
        // Tabla de atributos (ej: Color, Talla, Material, etc.)
        Schema::create('attributes', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name'); // Nombre del atributo (ej: "Color", "Talla")
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('required')->default(false); // Si es obligatorio para productos
            $table->integer('order')->default(0); // Para ordenar los atributos
            $table->timestamps();
        });

        // Tabla pivote para relacionar items con atributos y sus valores
        Schema::create('item_attribute', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade');
            $table->foreignUuid('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->string('value'); // Valor del atributo (ej: "Rojo", "M", "Acero")
            $table->timestamps();
            
            // Índice único para evitar duplicados
            $table->unique(['item_id', 'attribute_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_attribute');
        Schema::dropIfExists('attributes');
    }
};
