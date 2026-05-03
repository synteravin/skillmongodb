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
        Schema::create('career_groups', function (Blueprint $collection) {
            $collection->foreignId('course_id');
            $collection->string('name');
            $collection->string('slug')->unique();
            $collection->unsignedInteger('order')->default(1);
            $collection->timestamps();
            $collection->index('course_id');
            $collection->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('career_groups');
    }
};
