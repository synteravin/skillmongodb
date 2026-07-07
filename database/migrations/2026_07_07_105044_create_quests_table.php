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
        Schema::create('quests', function (Blueprint $collection) {
            $collection->string('title');
            $collection->text('description');
            $collection->integer('min_salary');
            $collection->integer('max_salary');
            $collection->dateTime('deadline');
            $collection->string('status')->default('open');
            $collection->foreignId('creator_id');
            $collection->foreignId('worker_id')->nullable();
            $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
