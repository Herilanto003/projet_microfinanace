<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{

    use HasFactory;

    // Champ à remplir
    protected $fillable = [
        'nom_transaction',
        'description_transaction',
        'date_transaction',
        'montant_transaction',
        'type_transaction',
        'compte_id'
    ];

    // Obtenir le compte
    public function compte()
    {
        return $this->belongsTo(Compte::class);
    }

    // Obtenir les historiques liés à cette transaction
    public function historiques()
    {
        return $this->hasMany(Historique::class);
    }
}
