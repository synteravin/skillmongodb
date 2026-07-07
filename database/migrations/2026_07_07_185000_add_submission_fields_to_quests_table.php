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
            $collection->string('submission_link')->nullable();
            $collection->text('submission_note')->nullable();
            $collection->dateTime('submitted_at')->nullable();
            $collection->dateTime('completed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quests', function (Blueprint $collection) {
            $collection->dropColumn(['submission_link', 'submission_note', 'submitted_at', 'completed_at']);
        });
    }
};
