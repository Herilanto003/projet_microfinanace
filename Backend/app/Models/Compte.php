<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_compte',
        'description_compte',
        'solde_compte',
        'statut_compte',
        'client_id'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Obtenir toutes les transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Obtenir tous les historiques
    public function historiques()
    {
        return $this->hasMany(Historique::class);
    }
}
