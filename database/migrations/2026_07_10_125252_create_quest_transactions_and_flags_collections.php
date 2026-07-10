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
        Schema::create('quest_transactions', function (Blueprint $collection) {
            $collection->foreignId('quest_id');
            $collection->foreignId('user_id');
            $collection->integer('amount');
            $collection->string('type');
            $collection->string('description')->nullable();
            $collection->timestamps();
        });

        Schema::create('quest_flags', function (Blueprint $collection) {
            $collection->foreignId('reporter_id');
            $collection->foreignId('reported_user_id')->nullable();
            $collection->foreignId('quest_id');
            $collection->string('reason');
            $collection->text('details')->nullable();
            $collection->string('status')->default('pending');
            $collection->string('action_taken')->nullable();
            $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quest_transactions');
        Schema::dropIfExists('quest_flags');
    }
};
