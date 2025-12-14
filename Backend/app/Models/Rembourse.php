<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rembourse extends Model
{

    use HasFactory;
    //

    protected $fillable = [
        'montant_rembourse',
        'date_rembourse',
        'mode_paiement_rembourse',
        'pret_id'
    ];
}
