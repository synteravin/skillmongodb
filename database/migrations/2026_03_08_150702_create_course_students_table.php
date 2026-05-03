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
        Schema::create('course_students', function (Blueprint $collection) {
            $collection->foreignId('course_id');
            $collection->foreignId('user_id');
            $collection->string('status')->default('active');
            $collection->timestamp('enrolled_at')->nullable();
            $collection->timestamp('completed_at')->nullable();
            $collection->timestamps();
            $collection->index(['course_id', 'user_id']);
            $collection->index('user_id');
            $collection->index('course_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_students');
    }
};
