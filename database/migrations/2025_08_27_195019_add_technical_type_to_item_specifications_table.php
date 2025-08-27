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
        Schema::table('item_specifications', function (Blueprint $table) {
            // Modificar el enum para incluir 'technical'
            $table->enum('type', ['principal', 'general', 'technical'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_specifications', function (Blueprint $table) {
            // Revertir el enum a su estado original
            $table->enum('type', ['principal', 'general'])->change();
        });
    }
};
