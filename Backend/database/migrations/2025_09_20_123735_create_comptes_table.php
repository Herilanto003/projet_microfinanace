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

        Schema::create('comptes', function (Blueprint $table) {
            $table->id();
            $table->string('nom_compte');
            $table->text('description_compte')->nullable();
            $table->decimal('solde_compte', 15, 2)->default(0); // 15 chiffres dont 2 décimales
            $table->enum('statut_compte', ['Active', 'Inactive'])->default('Active');
            $table->boolean('tag')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comptes');
    }
};
