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
        Schema::create('job_applications', function (Blueprint $table) {
             $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->string('cv_file')->nullable();
         
            $table->text('notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
         
            $table->boolean('status')->default(true);
            $table->boolean('visible')->default(true);
            $table->boolean('seen')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
