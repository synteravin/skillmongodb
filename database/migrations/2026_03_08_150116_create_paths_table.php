<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('paths', function (Blueprint $collection) {
            $collection->foreignId('course_id');
            $collection->foreignId('career_group_id')->nullable();
            $collection->string('phase');
            $collection->string('name');
            $collection->string('slug')->unique();
            $collection->text('description')->nullable();
            $collection->string('thumbnail')->nullable();
            $collection->unsignedInteger('order')->default(1);
            $collection->timestamps();
            $collection->index('course_id');
            $collection->index('career_group_id');
            $collection->index('phase');
            $collection->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paths');
    }
};
