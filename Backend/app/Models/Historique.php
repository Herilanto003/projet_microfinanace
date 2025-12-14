<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    use HasFactory;

    // Champs à remplir
    protected $fillable = [
        "solde_avant",
        "solde_apres",
        "compte_id",
        "transaction_id"
    ];

    // Relation avec le compte
    public function compte()
    {
        return $this->belongsTo(Compte::class);
    }

    // Relation avec la transaction
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
