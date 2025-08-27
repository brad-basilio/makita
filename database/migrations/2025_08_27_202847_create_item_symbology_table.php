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
        Schema::create('item_symbology', function (Blueprint $table) {
            $table->id();
            $table->uuid('item_id');
            $table->uuid('symbology_id');
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            $table->foreign('symbology_id')->references('id')->on('symbologies')->onDelete('cascade');
            
            $table->unique(['item_id', 'symbology_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_symbology');
    }
};
