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
        Schema::create('characters', function (Blueprint $collection) {
            $collection->string('name');
            $collection->string('avatar')->nullable();
            $collection->json('character_type')->nullable();
            $collection->string('tagline')->nullable();
            $collection->json('abilities')->nullable();
            $collection->json('guide_power')->nullable();
            $collection->text('backstory')->nullable();
            $collection->json('personality')->nullable();
            $collection->json('system_bonus')->nullable();
            $collection->json('cosmetic_bonus')->nullable();
            $collection->string('quote')->nullable();
            $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('characters');
    }
};
