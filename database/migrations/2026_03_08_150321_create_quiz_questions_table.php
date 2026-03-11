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
        Schema::create('quiz_questions', function (Blueprint $collection) {
            $collection->foreignId('quiz_id');
            $collection->text('question_text');
            $collection->string('media_url')->nullable();
            $collection->unsignedInteger('order')->default(1);
            $collection->timestamps();
            $collection->index('quiz_id');
            $collection->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
