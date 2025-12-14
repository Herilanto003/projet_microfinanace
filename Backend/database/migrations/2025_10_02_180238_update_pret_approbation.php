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
        Schema::table('prets', function (Blueprint $table) {
            //
            $table->enum('approbation_pret', ['APPROUVE', 'EN_ATTENTE', 'REFUSE'])->default('EN_ATTENTE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prets', function (Blueprint $table) {
            //
            $table->dropColumn('approbation_pret');
        });
    }
};
