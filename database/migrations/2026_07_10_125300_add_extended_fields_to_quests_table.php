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
            $collection->string('tier')->default('C');
            $collection->json('custom_rewards')->nullable();
            $collection->json('dispute')->nullable();
            $collection->json('submission_history')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quests', function (Blueprint $collection) {
            $collection->dropColumn(['tier', 'custom_rewards', 'dispute', 'submission_history']);
        });
    }
};
