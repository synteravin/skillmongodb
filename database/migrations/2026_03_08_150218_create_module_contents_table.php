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
        Schema::create('module_contents', function (Blueprint $collection) {
            $collection->foreignId('module_id');
            $collection->string('type');
            $collection->json('content');
            $collection->unsignedInteger('order')->default(1);
            $collection->timestamps();
            $collection->index('module_id');
            $collection->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_contents');
    }
};
