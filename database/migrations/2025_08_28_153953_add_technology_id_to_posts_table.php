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
        Schema::table('posts', function (Blueprint $table) {
            $table->uuid('post_category_id')->nullable()->after('category_id');
            $table->uuid('technology_id')->nullable()->after('post_category_id');
            
            $table->foreign('post_category_id')->references('id')->on('post_categories')->onDelete('set null');
            $table->foreign('technology_id')->references('id')->on('technologies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['post_category_id']);
            $table->dropForeign(['technology_id']);
            $table->dropColumn(['post_category_id', 'technology_id']);
        });
    }
};
