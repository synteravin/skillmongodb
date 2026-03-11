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
        Schema::create('courses', function (Blueprint $collection) {
            $collection->string('title');
            $collection->string('slug')->unique();
            $collection->text('description')->nullable();
            $collection->string('thumbnail')->nullable();
            $collection->foreignId('mentor_id')->nullable();
            $collection->string('level');
            $collection->string('status')->default('draft');
            $collection->boolean('is_active')->default(true);
            $collection->timestamp('published_at')->nullable();
            $collection->foreignId('published_by')->nullable();
            $collection->timestamps();
            // $collection->index('slug');
            $collection->index('mentor_id');
            $collection->index('status');
            $collection->index('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
