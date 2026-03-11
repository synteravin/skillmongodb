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
        Schema::create('modules', function (Blueprint $collection) {
            $collection->foreignId('path_id');
            $collection->string('type');
            $collection->string('title');
            $collection->string('slug')->unique();
            $collection->unsignedInteger('order')->default(1);
            $collection->timestamps();
            $collection->index('path_id');
            $collection->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
