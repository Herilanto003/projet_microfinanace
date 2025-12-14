<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Compte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransfertController extends Controller
{
    // Transfert des soldes d'un compte à un autre
    public function transfert(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'compte_id' => 'required|numeric',
                'compte_id_destinataire' => 'required|numeric',
                'montant_transfert' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            $inputTransfert = $request->all();

            $compte = Compte::find($inputTransfert['compte_id']);

            if (!$compte) {
                return response()->json([
                    'success' => false,
                    'message' => 'Compte introuvable',
                ], 404);
            }

            $compteDestinataire = Compte::find($inputTransfert['compte_id_destinataire']);

            if (!$compteDestinataire) {
                return response()->json([
                    'success' => false,
                    'message' => 'Compte destinataire introuvable',
                ], 404);
            }

            if ($compte->solde_compte < $inputTransfert['montant_transfert']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Solde insuffisant',
                ], 400);
            }

            $compte->solde_compte -= $inputTransfert['montant_transfert'];
            $compte->save();

            $compteDestinataire->solde_compte += $inputTransfert['montant_transfert'];
            $compteDestinataire->save();

            return response()->json([
                'success' => true,
                'message' => 'Transfert effectué avec succès',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
