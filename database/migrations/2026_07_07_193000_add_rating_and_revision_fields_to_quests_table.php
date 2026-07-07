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
        Schema::table('quests', function (Blueprint $collection) {
            $collection->text('revision_note')->nullable();
            $collection->integer('rating')->nullable();
            $collection->text('rating_comment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quests', function (Blueprint $collection) {
            $collection->dropColumn(['revision_note', 'rating', 'rating_comment']);
        });
    }
};
