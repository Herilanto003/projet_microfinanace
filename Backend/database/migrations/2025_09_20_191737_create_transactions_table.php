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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('nom_transaction');
            $table->string('description_transaction');
            $table->date('date_transaction')->default(now());
            $table->string('montant_transaction');
            $table->enum('type_transaction', ['DEPOT', 'RETRAIT']);
            $table->unsignedBigInteger('compte_id');
            $table->timestamps();

            // Clé étrangère vers compte
            $table->foreign('compte_id')->references('id')->on('comptes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
