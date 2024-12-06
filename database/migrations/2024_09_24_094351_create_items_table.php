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
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name');
            $table->longText('summary')->nullable();
            $table->longText('description')->nullable();
            $table->integer('sessions')->nullable();
            $table->string('type')->default('Presencial');
            $table->string('certificate')->default('Físico y Virtual PDF');
            $table->integer('session_duration')->nullable();
            $table->integer('long_duration')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('discount', 10, 2)->default(0.00)->nullable();
            $table->integer('students')->default(0);
            $table->string('image')->nullable();
            $table->longText('audience')->nullable();
            $table->longText('requirements')->nullable();
            $table->longText('objectives')->nullable();
            $table->longText('content')->nullable();
            $table->char('category_id', 36)->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true)->nullable();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
