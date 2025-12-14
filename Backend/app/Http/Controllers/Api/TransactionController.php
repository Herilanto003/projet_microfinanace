<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Compte;
use App\Models\Historique;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    // Créer une transaction
    public function saveTransaction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom_transaction' => 'required|string',
                'description_transaction' => 'required|string',
                'date_transaction' => 'required|date',
                'type_transaction' => 'required|in:DEPOT,RETRAIT',
                'compte_id' => 'required|numeric',
                'montant_transaction' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first(),
                ], 400);
            }

            $inputTransaction = $request->all();

            $compte = Compte::find($inputTransaction['compte_id']);

            if (!$compte) {
                return response()->json([
                    'success' => false,
                    'message' => 'COMPTE_NOT_FOUND',
                ], 400);
            }

            if ($compte->statut_compte != 'Active') {
                return response()->json([
                    'success' => false,
                    'message' => 'COMPTE_NOT_YET_ACTIVE',
                ], 400);
            }

            // dd($inputTransaction, $compte);

            DB::beginTransaction();

            switch ($inputTransaction['type_transaction']) {
                case 'DEPOT':
                    // Addition de solde dans le compte avec celle de transaction
                    // Dans historique :: solde_avant = solde_compte et solde_apres = solde_compte + montant_transaction
                    // Dans compte :: solde_compte = solde_compte + montant_transaction

                    $transaction = Transaction::create($inputTransaction);

                    $historique = Historique::create([
                        'solde_avant' => $compte->solde_compte,
                        'solde_apres' => $compte->solde_compte + $inputTransaction['montant_transaction'],
                        'compte_id' => $compte->id,
                        'transaction_id' => $transaction->id
                    ]);

                    $compte->solde_compte += $inputTransaction['montant_transaction'];
                    $compte->save();

                    break;

                case 'RETRAIT':
                    // Soustraction de solde dans le compte avec celle de transaction
                    // Si (solde_compte - montant_transaction) < 0 alors :: retrait impossible 
                    // Sinon dans historique :: solde_avant = solde_compte et solde_apres = solde_compte - montant_transaction et dans le compte :: solde_compte = solde_compte - montant_transaction

                    if ($inputTransaction['montant_transaction'] > $compte->solde_compte) {
                        return response()->json([
                            'success' => false,
                            'message' => 'IMPOSSIBLE_TRANSACTION_WITH_SOLDE_LESS_THAN_TRANSACTION_AMOUNT'
                        ], 400);
                    }

                    $transaction = Transaction::create($inputTransaction);

                    $historique = Historique::create([
                        'solde_avant' => $compte->solde_compte,
                        'solde_apres' => $compte->solde_compte - $inputTransaction['montant_transaction'],
                        'compte_id' => $compte->id,
                        'transaction_id' => $transaction->id
                    ]);

                    $compte->solde_compte -= $inputTransaction['montant_transaction'];
                    $compte->save();

                    break;
                
                default:

                    if ($inputTransaction['montant_transaction'] > $compte->solde) {
                        return response()->json([
                            'success' => false,
                            'message' => 'NO_TRANSACTION_TYPE_SELECTED'
                        ], 400);
                    }
                    break;
            }

            DB::commit();

            return response()->json([
                "success" => true,
                "data" => $transaction
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    // Obtenir toutes les transactions
    public function getAllTransactions()
    {
        try {

            $transactions = Transaction::with('compte')->with('compte.client')->get();

            return response()->json([
                "success" => true,
                "data"=> $transactions
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir pour plus d'infos sur la transaction
    public function getInfoTransaction($id)
    {
        try {

            if (!Transaction::find($id)) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'TRANSACTION_NOT_FOUND'
                ],404);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'transactions.montant_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('transactions.id', '=', $id)
                ->get()
                ->first();

            $transaction = Transaction::with('compte')->with('compte.client')->find($id);

            return response()->json([
                'success'=> true,
                'data'=> $results,
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Supprimer une transaction
    public function deleteTransaction($id)
    {
        try {
            $transaction = Transaction::find($id);

            if (!$transaction) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'TRANSACTION_NOT_FOUND'
                ],404);
            }

            $transaction->delete();

            return response()->json([
                'success'=> true,
                'message'=> 'TRANSACTION_DELETED_SUCCESSFULLY'
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir un historique de tous les transactions
    public function getAllHistoriquesTransactions()
    {
        try {

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir tous les historiques de transactions entre deux dates
    public function getHistoriquesBetweenTwoDates($startDate, $endDate)
    {
        try {

            if (!$startDate and !$endDate) {
                return response()->json([
                    "success" => false,
                    'message' => 'STARDATE_AND_ENDDATE_ARE_REQUIRED'
                ], 400);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->whereBetween('transactions.date_transaction', [$startDate, $endDate])
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir les transactions par compte :: par id du comptes
    public function getHistoriquesParCompte($id)
    {
        try {

            $comptes = Compte::find($id);

            if (!$comptes) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'COMPTE_NOT_FOUND'
                ],404);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('comptes.id', '=', $id)
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir les transactions par client :: par id du clients
    public function getHistoriquesParClient($id)
    {
        try {

            $clients = Client::find($id);

            if (!$clients) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'CLIENT_NOT_FOUND'
                ],404);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('clients.id', '=', $id)
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    // Obtenir les transactions par compte avant une date
    public function getHistoriquesParCompteAvantDate($id, $date)
    {
        try {

            $comptes = Compte::find($id);

            if (!$comptes) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'COMPTE_NOT_FOUND'
                ],404);
            }

            if (!$date) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'DATE_ERROR'
                ],400);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('comptes.id', '=', $id)
                ->where('transactions.date_transaction', '<=', $date)
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }    

    // Obtenir les transactions par compte après une date
    public function getHistoriquesParCompteApresDate($id, $date)
    {
        try {

            $comptes = Compte::find($id);

            if (!$comptes) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'COMPTE_NOT_FOUND'
                ],404);
            }

            if (!$date) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'DATE_ERROR'
                ],400);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('comptes.id', '=', $id)
                ->where('transactions.date_transaction', '>=', $date)
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }  

    // Obtenir les transactions par client avant une date
    public function getHistoriquesParClientAvantDate($id, $date)
    {
        try {

            $clients = Client::find($id);

            if (!$clients) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'CLIENT_NOT_FOUND'
                ],404);
            }

            if (!$date) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'DATE_ERROR'
                ],400);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('clients.id', '=', $id)
                ->where('transactions.date_transaction', '<=', $date)
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }  

    // Obtenir les transactions par client après une date
    public function getHistoriquesParClientApresDate($id, $date)
    {
        try {

            $clients = Client::find($id);

            if (!$clients) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'CLIENT_NOT_FOUND'
                ],404);
            }

            if (!$date) {
                return response()->json([
                    'success'=> false,
                    'message'=> 'DATE_ERROR'
                ],400);
            }

            $results = DB::table('clients')
                ->join('comptes','clients.id','=','comptes.client_id')
                ->join('transactions', 'comptes.id', '=', 'transactions.compte_id')
                ->join('historiques', 'transactions.id', '=', 'historiques.transaction_id' )
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.nom_transaction',
                    'transactions.description_transaction',
                    'transactions.date_transaction',
                    'transactions.type_transaction',
                    'comptes.id as compte_id',
                    'comptes.nom_compte',
                    'comptes.description_compte',
                    'comptes.solde_compte',
                    'comptes.statut_compte',
                    'historiques.id as historique_id',
                    'historiques.solde_avant',
                    'historiques.solde_apres',
                    'clients.id as client_id',
                    'clients.nom_client',
                    'clients.prenom_client',
                    'clients.cin_client',
                    'clients.adresse_client',
                    'clients.email_client',
                    'clients.telephone_client'
                )
                ->where('clients.id', '=', $id)
                ->where('transactions.date_transaction', '>=', $date)
                ->get();

            return response()->json([
                'success'=> true,
                'data'=> $results
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }  
}
