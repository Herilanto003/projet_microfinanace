<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{

    use HasFactory;

    // Les champs à remplir
    protected $fillable = [
        "nom_client",
        "prenom_client",
        "adresse_client",
        "cin_client",
        "email_client",
        "telephone_client",
    ];

    public function comptes()
    {
        return $this->hasMany(Compte::class);
    }
}
