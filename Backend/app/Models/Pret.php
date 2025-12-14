<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pret extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre_pret',
        'description_pret',
        'statut_pret',
        'date_pret',
        'montant_pret',
        'client_id',
        'periode',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
