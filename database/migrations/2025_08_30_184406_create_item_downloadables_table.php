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
        Schema::create('item_downloadables', function (Blueprint $table) {
              $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->uuid('item_id');
            $table->string('original_name');
            $table->string('url');
            $table->bigInteger('size')->nullable();
            $table->string('mime_type')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            $table->index(['item_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_downloadables');
    }
};
