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
        Schema::create('historique_compte_client', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compte_id')->constrained('comptes');
            $table->string('type_operation');
            $table->decimal('montant', 10, 2);
            $table->decimal('solde_avant', 10, 2);
            $table->decimal('solde_apres', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_compte_client');
    }
};
