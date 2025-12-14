<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    // Obtenir tous les clients
    public function index()
    {
        try {

            $clients = Client::where("tag", false)->get();

            return response()->json([
                "success" => true,
                "data" => $clients->values(),
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Obtenir un client
    public function show($id)
    {
        try {

            $client = Client::find($id);

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            return response()->json([
                "success" => true,
                "data" => $client
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Créer un client
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                "nom_client" => "required|string",
                "prenom_client" => "required|string",
                "adresse_client" => "required|string",
                "cin_client" => "required|string",
                "email_client" => "required|email",
                "telephone_client" => "required|string"
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "success" => false,
                    "message" => $validator->errors()->first(),
                ], 400);
            }

            $client = Client::create($request->all());

            return response()->json([
                "success" => true,
                "data" => $client
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Mise à jour d'un client
    public function update(Request $request, $id)
    {
        try {

            $validator = Validator::make($request->all(), [
                "nom_client" => "required|string",
                "prenom_client" => "required|string",
                "adresse_client" => "required|string",
                "cin_client" => "required|string",
                "email_client" => "required|email",
                "telephone_client" => "required|string"
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "success" => false,
                    "message" => $validator->errors()->first(),
                ], 400);
            }

            $client = Client::find($id);

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            $client->update($request->all());

            return response()->json([
                "success" => true,
                "data" => $client
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Supprimer un client
    public function destroy($id)
    {
        try {

            $client = Client::find($id);

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            $client->delete();

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

    // Supprimer un client avec tag
    public function updateTag($id)
    {
        try {

            $client = Client::find($id);

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            $client->tag = true;

            $client->save();

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

    // Assigner un compte de connexion
    public function link_account($id, $id_c)
    {
        try {

            $client = Client::find($id);

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            $client->id_c = $id_c;

            $client->save();

            return response()->json([
                "success" => true,
                "message" => "ACCOUNT_LINKED"
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Obtenir un client par son compte
    public function get_client_by_account($id_c)
    {
        try {

            $client = Client::where('id_c', $id_c)->first();

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            return response()->json([
                "success" => true,
                "data" => $client
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }
}

