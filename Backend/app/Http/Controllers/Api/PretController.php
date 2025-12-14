<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SendMailPret;
use App\Models\Client;
use App\Models\Pret;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class PretController extends Controller
{
    // Obtenir tous les prets
    public function index()
    {
        try {

            $prets = Pret::with('client')->whereHas('client', function ($query) {
                $query->where('tag', false);
            })->get();

            return response()->json([
                'success' => true,
                'data' => $prets
            ], 200);


        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    // Obtenir un prets
    public function show($id)
    {
        try {

            $pret = Pret::with('client')->find($id);

            if (!$pret) {
                return response()->json([
                    "success" => false,
                    'message' => 'PRET_NOT_FOUND'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $pret
            ], 200);


        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Créer un prêt
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre_pret' => 'required',
            'description_pret' => 'required',
            'statut_pret' => 'required|in:EN COURS,TERMINE,IMPAYE',
            'date_pret' => 'required|date',
            'montant_pret' => 'required',
            'client_id' => 'required',
            'periode' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $inputPrets = $request->all();

        $clients = Client::find($inputPrets["client_id"]);

        if (!$clients || $clients->tag) {
            return response()->json([
                "success" => false,
                "message" => "CLIENT_NOT_FOUND"
            ], 400);
        }

        try {

            $pret = Pret::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $pret
            ], 201);


        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    // MAJ un pret
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'titre_pret' => 'required',
            'description_pret' => 'required',
            'statut_pret' => 'required|in:EN COURS,TERMINE,IMPAYE',
            'date_pret' => 'required|date',
            'montant_pret' => 'required',
            'client_id' => 'required',
            'periode' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $pret = Pret::find($id);

        if (!$pret) {
            return response()->json([
                'success' => false,
                'message' => 'PRET_NOT_FOUND',
            ], 400);
        }

        $inputPrets = $request->all();

        $clients = Client::find($inputPrets["client_id"]);

        if (!$clients || $clients->tag) {
            return response()->json([
                "success" => false,
                "message" => "CLIENT_NOT_FOUND"
            ], 400);
        }

        try {

            $pret->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $pret
            ], 201);


        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    // Supprimer un pret
    public function destroy($id)
    {
        $pret = Pret::find($id);

        if (!$pret) {
            return response()->json([
                'success' => false,
                'message' => 'PRET_NOT_FOUND',
            ], 400);
        }

        try {

            $pret->delete();

            return response()->json([
                'success' => true,
                'message' => 'DESTROY_SUCCESSFULLY'
            ], 201);


        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Approuver un pret
    public function approuvePret($id)
    {
        try {

            $pret = Pret::findOrFail($id);

            $client = Client::findOrFail($pret->client_id);

            // modification pret
            $pret->approbation_pret = 'APPROUVE';

            $pret->save();

            $data = [
                "title" => "Bonjour $client->nom_client $client->prenom_client",
                "body" => '
        <p style="margin:0 0 15px 0; font-size:16px; color:#333;">
            Votre demande de prêt a été <strong style="color:green;">validée ✅</strong> !
        </p>
        
        <table width="100%" cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse; font-size:14px; color:#333;">
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Numéro du prêt</td>
                <td style="border:1px solid #ddd;">' . $pret->id . '</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Titre</td>
                <td style="border:1px solid #ddd;">' . $pret->titre_pret . '</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Description</td>
                <td style="border:1px solid #ddd;">' . $pret->description_pret . '</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Montant</td>
                <td style="border:1px solid #ddd; font-weight:bold; color:#4CAF50;">' . number_format($pret->montant_pret, 0, ",", " ") . ' Ar</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Date du prêt</td>
                <td style="border:1px solid #ddd;">' . date("d/m/Y", strtotime($pret->date_pret)) . '</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Période</td>
                <td style="border:1px solid #ddd;">' . $pret->periode . ' mois</td>
            </tr>
            <!-- Nouvelle ligne montant de retour -->
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Montant de retour</td>
                <td style="border:1px solid #ddd; font-weight:bold; color:#E53935;">' . number_format(($pret->montant_pret * (1 + ($pret->taux_pret / 100))), 0, ",", " ") . ' Ar</td>
            </tr>
            <!-- Nouvelle ligne date de retour -->
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Date de retour</td>
                <td style="border:1px solid #ddd;">' . date("d/m/Y", strtotime("+" . $pret->periode . " months", strtotime($pret->date_pret))) . '</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Taux</td>
                <td style="border:1px solid #ddd;">' . $pret->taux_pret . ' %</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Statut</td>
                <td style="border:1px solid #ddd; font-weight:bold; color:orange;">' . $pret->statut_pret . '</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd; background:#f9f9f9; font-weight:bold;">Approbation</td>
                <td style="border:1px solid #ddd; font-weight:bold; color:green;">' . $pret->approbation_pret . '</td>
            </tr>
        </table>

        <p style="margin-top:20px; font-size:14px; color:#555;">
            Merci pour votre confiance.<br>
            L\'équipe Crédit Solidaire.
        </p>
    '
            ];

            try {
                Mail::to($client->email_client)->send(new SendMailPret($data));
            } catch (\Throwable $th) {
                $pret->approbation_pret = "EN_ATTENTE";
                $pret->save();
                return response()->json([
                    "success" => false,
                    "message" => $th->getMessage()
                ], 400);
            }


            // envoyer un email

            return response()->json([
                "success" => true,
                "data" => $pret
            ], 202);

        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 400);
        }
    }

    // Liste des prets entre deux dates
    public function getPretEntreDeuxDates($startDate, $endDate)
    {
        try {

            if ($startDate > $endDate) {
                return response()->json([
                    'success' => false,
                    'message' => 'ERROR :: START_DATE > END_DATE'
                ], 400);
            }

            $result = DB::table('prets')
                ->join('clients', 'prets.client_id', '=', 'clients.id')
                ->whereBetween('prets.date_pret', [$startDate, $endDate])
                ->where('tag', false)
                ->get()
            ;

            return response()->json([
                'success' => true,
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Liste des prets par clients
    public function getPretParClient($clientId)
    {
        try {

            $client = Client::find($clientId);

            if (!$client || $client->tag) {
                return response()->json([
                    "success" => false,
                    "message" => "CLIENT_NOT_FOUND"
                ], 404);
            }

            $result = DB::table('prets')
                ->join('clients', 'prets.client_id', '=', 'clients.id')
                ->where('clients.id', '=', $clientId)
                ->where('clients.tag', false)
                ->get()
            ;

            return response()->json([
                'success' => true,
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Liste des prets par clients entre deux dates
    public function getPretParClientEntreDeuxDates($clientId, $startDate, $endDate)
    {

        $client = Client::find($clientId);

        if (!$client || $client->tag) {
            return response()->json([
                "success" => false,
                "message" => "CLIENT_NOT_FOUND"
            ], 404);
        }

        if ($startDate > $endDate) {
            return response()->json([
                'success' => false,
                'message' => 'ERROR :: START_DATE > END_DATE'
            ], 400);
        }

        try {

            $result = DB::table('prets')
                ->join('clients', 'prets.client_id', '=', 'clients.id')
                ->whereBetween('prets.date_pret', [$startDate, $endDate])
                ->where('clients.id', '=', $clientId)
                ->get()
            ;

            return response()->json([
                'success' => true,
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
