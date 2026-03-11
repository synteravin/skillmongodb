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
        Schema::create('user_stats', function (Blueprint $collection) {
            $collection->foreignId('user_id');
            $collection->unsignedInteger('xp')->default(0);
            $collection->unsignedInteger('level')->default(1);
            $collection->unsignedInteger('streak')->default(0);
            $collection->json('completed_modules')->nullable();
            $collection->json('completed_paths')->nullable();
            $collection->timestamps();
            $collection->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_stats');
    }
};
