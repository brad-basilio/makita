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
        Schema::table('items', function (Blueprint $table) {
            $table->uuid('platform_id')->nullable()->after('brand_id');
            $table->uuid('family_id')->nullable()->after('platform_id');
            
            $table->foreign('platform_id')->references('id')->on('platforms')->onDelete('set null');
            $table->foreign('family_id')->references('id')->on('families')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['platform_id']);
            $table->dropForeign(['family_id']);
            $table->dropColumn(['platform_id', 'family_id']);
        });
    }
};