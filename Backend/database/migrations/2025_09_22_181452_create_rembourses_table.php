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
        Schema::create('rembourses', function (Blueprint $table) {
            $table->id();
            $table->decimal('montant_rembourse', 15, 2);
            $table->date('date_rembourse');
            $table->enum('mode_paiement_rembourse', ['VIREMENT', 'CHEQUE', 'CASH']);
            $table->unsignedBigInteger('pret_id');
            $table->timestamps();

            $table->foreign('pret_id')->references('id')->on('prets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rembourses');
    }
};
