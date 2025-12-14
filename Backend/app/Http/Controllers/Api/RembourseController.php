<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pret;
use App\Models\Rembourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RembourseController extends Controller
{
    // Créer un remboursement
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'montant_rembourse' => 'required',
            'date_rembourse' => 'required',
            'mode_paiement_rembourse' => 'required|in:VIREMENT,CHEQUE,CASH',
            'pret_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        try {

            $inputRembourse = $request->all();

            $pret = Pret::find($inputRembourse['pret_id']);

            if (!$pret) {
                return response()->json([
                    'success' => false,
                    'message' => 'PRET_NOT_FOUND',
                ], 400);
            }

            $rembourse = Rembourse::create($inputRembourse);

            return response()->json([
                'success' => true,
                'data' => $rembourse
            ], 201);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }


    }

    // Mettre à jour un rembourssement
    public function update($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'montant_rembourse' => 'required',
            'date_rembourse' => 'required',
            'mode_paiement_rembourse' => 'required|in:VIREMENT,CHEQUE,CASH',
            'pret_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        try {

            $rembourse = Rembourse::find($id);

            if (!$rembourse) {
                return response()->json([
                    'success' => false,
                    'message' => 'REMBOURSE_NOT_FOUND',
                ], 400);
            }

            $inputRembourse = $request->all();

            $pret = Pret::find($inputRembourse['pret_id']);

            if (!$pret) {
                return response()->json([
                    'success' => false,
                    'message' => 'PRET_NOT_FOUND',
                ], 400);
            }

            $rembourse->update($inputRembourse);

            return response()->json([
                'success' => true,
                'data' => $rembourse
            ], 201);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Mettre à jour un rembourssement
    public function delete($id, Request $request)
    {

        try {

            $rembourse = Rembourse::find($id);

            if (!$rembourse) {
                return response()->json([
                    'success' => false,
                    'message' => 'REMBOURSE_NOT_FOUND',
                ], 404);
            }

            $rembourse->delete();

            return response()->json([
                'success' => true,
                'data' => $rembourse
            ], 204);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir tous les rembourssement
    public function index()
    {
        try {
            $rembourse = DB::table('rembourses')
                ->join('prets', 'rembourses.pret_id', '=', 'prets.id')
                ->join('clients', 'prets.client_id', '=', 'clients.id')
                ->select(
                    'rembourses.id as rembouses_id',
                    'rembourses.montant_rembourse',
                    'rembourses.date_rembourse',
                    'rembourses.mode_paiement_rembourse',
                    'prets.id as pret_id',
                    'prets.titre_pret',
                    'prets.description_pret',
                    'prets.date_pret',
                    'prets.montant_pret',
                    'prets.statut_pret',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->get();
            ;

            return response()->json([
                'success' => true,
                'data' => $rembourse
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir un remboursement
    public function show($id)
    {
        try {
            $rembourse = Rembourse::find($id);
            if (!$rembourse) {
                return response()->json([
                    'success' => false,
                    'message' => 'REMBOURSE_NOT_FOUND'
                ], 404);
            }

            $rembourse = DB::table('rembourses')
                ->join('prets', 'rembourses.pret_id', '=', 'prets.id')
                ->join('clients', 'prets.client_id', '=', 'clients.id')
                ->select(
                    'rembourses.id as rembouses_id',
                    'rembourses.montant_rembourse',
                    'rembourses.date_rembourse',
                    'rembourses.mode_paiement_rembourse',
                    'prets.id as pret_id',
                    'prets.titre_pret',
                    'prets.description_pret',
                    'prets.date_pret',
                    'prets.montant_pret',
                    'prets.statut_pret',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'

                )
                ->where('rembourses.id', '=', $id)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $rembourse
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }
}
