<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Compte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompteController extends Controller
{
    // Obtenir tous les comptes
    public function index()
    {
        try {

            $comptes = Compte::with("client")->get()->where("tag", false);

            return response()->json([
                "success" => true,
                "data" => $comptes,
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Obtenir un compte
    public function show($id)
    {
        try {

            $compte = Compte::with("client")->find($id);

            if (!$compte || $compte->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "COMPTE_NOT_FOUND"
                ], 404);
            }

            return response()->json([
                "success" => true,
                "data" => $compte
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Créer un compte
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                "client_id" => "required|numeric",
                "nom_compte" => "required|string",
                "description_compte" => "required|string",
                "solde_compte" => "required|numeric",
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "success" => false,
                    "message" => $validator->errors()->first(),
                ], 400);
            }

            $inputComptes = $request->all();

            $clients = Client::find($inputComptes["client_id"]);

            if (!$clients || $clients->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 400);
            }

            $inputComptes["statut_compte"] = "Inactive";

            $compte = Compte::create($inputComptes);

            return response()->json([
                "success" => true,
                "data" => $compte
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Mise à jour d'un compte
    public function update(Request $request, $id)
    {
        try {

            $validator = Validator::make($request->all(), [
                "nom_compte" => "required|string",
                "description_compte" => "required|string",
                "solde_compte" => "required|numeric",
                "statut_compte" => "required|in:Inactive,Active"
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "success" => false,
                    "message" => $validator->errors()->first(),
                ], 400);
            }

            $compte = Compte::find($id);

            if (!$compte || $compte->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "COMPTE_NOT_FOUND"
                ], 404);
            }

            $inputComptes = $request->all();

            $clients = Client::find($inputComptes["client_id"]);

            if (!$clients || $clients->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 400);
            }

            $compte->update($inputComptes);

            return response()->json([
                "success" => true,
                "data" => $compte
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Supprimer un compte
    public function destroy($id)
    {
        try {

            $compte = Compte::find($id);

            if (!$compte || $compte->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "COMPTE_NOT_FOUND"
                ], 404);
            }

            $compte->delete();

            return response()->json([
                "success" => true,
                "message" => "DESTROY_SUCCESSFULLY"
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Supprimer un compte avec tag
    public function updateTag($id)
    {
        try {

            $compte = Compte::find($id);

            if (!$compte || $compte->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "COMPTE_NOT_FOUND"
                ], 404);
            }

            $compte->tag = true;

            $compte->save();

            return response()->json([
                "success" => true,
                "message" => "DELETE_SUCCESSFULLY"
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    public function activeCompte($id)
    {
        try {

            $compte = Compte::find($id);

            if (!$compte || $compte->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "COMPTE_NOT_FOUND"
                ], 404);
            }

            if ($compte->statut_compte == 'Active') {
                return response()->json([
                    "success" => false,
                    "message" => "COMPTE_ALREADY_ACTIVE"
                ], 400);
            }

            $compte->statut_compte = 'Active';
            $compte->save();

            return response()->json([
                'success' => true,
                'message' => 'COMPTE_ACTIVE_SUCCESSFULLY'
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }
}
