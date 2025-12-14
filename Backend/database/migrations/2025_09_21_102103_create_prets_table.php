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
        Schema::create('prets', function (Blueprint $table) {
            $table->id();
            $table->string('titre_pret');
            $table->string('description_pret');
            $table->enum('statut_pret', ['EN COURS', 'TERMINE', 'IMPAYE']);
            $table->date('date_pret');
            $table->integer('periode'); // en mois
            $table->decimal('montant_pret', 15, 2);
            $table->unsignedBigInteger('client_id');
            $table->timestamps();

            // Clé étrangère vers clients
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prets');
    }
};
