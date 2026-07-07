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
        Schema::create('quest_bids', function (Blueprint $collection) {
            $collection->foreignId('quest_id');
            $collection->foreignId('student_id');
            $collection->integer('bid_amount');
            $collection->text('cv');
            $collection->text('portfolio');
            $collection->text('proposal');
            $collection->string('status')->default('pending');
            $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quest_bids');
    }
};
