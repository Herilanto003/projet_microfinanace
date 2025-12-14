<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Compte;
use App\Models\Pret;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminDashboardController extends Controller
{
    // Retourne les statistiques principales utilisées dans le dashboard
    public function stats(Request $request)
    {
        try {
            $totalClients = Client::count();

            // Tentatives d'estimations sûres en vérifiant l'existence des colonnes
            $clientsSupprimes = 0;
            if (Schema::hasColumn('clients', 'tag')) {
                $clientsSupprimes = Client::where('tag', true)->count();
            } elseif (Schema::hasColumn('clients', 'deleted_at')) {
                $clientsSupprimes = Client::whereNotNull('deleted_at')->count();
            }

            $clientsActifs = max(0, $totalClients - $clientsSupprimes);

            $pretsEnCours = 0;
            $pretsPayes = 0;
            $pretsImpayes = 0;
            if (Schema::hasTable('prets')) {
                if (Schema::hasColumn('prets', 'statut_pret')) {
                    $pretsEnCours = Pret::where('statut_pret', 'EN COURS')->count();
                    $pretsPayes = Pret::where('statut_pret', 'TERMINE')->count();
                    $pretsImpayes = Pret::where('statut_pret', 'IMPAYE')->count();
                } else {
                    $pretsEnCours = Pret::count();
                }
            }

            return response()->json([
                'totalClients' => $totalClients,
                'clientsSupprimes' => $clientsSupprimes,
                'clientsActifs' => $clientsActifs,
                'pretsEnCours' => $pretsEnCours,
                'pretsPayes' => $pretsPayes,
                'pretsImpayes' => $pretsImpayes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to compute stats',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Retourne une liste de transactions filtrables
    public function transactions(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');
        $compte = $request->query('compte');
        $action = $request->query('action');

        $q = Transaction::query();

        if (Schema::hasColumn('transactions', 'date_transaction')) {
            if ($start) {
                $q->where('date_transaction', '>=', $start);
            }
            if ($end) {
                $q->where('date_transaction', '<=', $end);
            }
        }

        if ($compte && Schema::hasColumn('transactions', 'compte_id')) {
            // rechercher par numéro de compte si fourni
            $q->whereHas('compte', function ($qb) use ($compte) {
                $qb->where('nom_compte', 'like', "%{$compte}%");
            });
        }

        if ($action && Schema::hasColumn('transactions', 'type_transaction')) {
            $q->where('type_transaction', $action);
        }

        $transactions = $q->with('compte.client')
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($t) {
                $client = null;
                if ($t->compte && $t->compte->client) {
                    $nom = $t->compte->client->nom_client ?? '';
                    $prenom = $t->compte->client->prenom_client ?? '';
                    $client = trim($nom . ' ' . $prenom) ?: null;
                }

                return [
                    'id' => $t->id,
                    'date' => $t->date_transaction ?? null,
                    'compte' => $t->compte->nom_compte ?? null,
                    'client' => $client,
                    'action' => $t->type_transaction ?? null,
                    'montant' => $t->montant_transaction ?? 0,
                    'solde' => $t->compte->solde_compte ?? null,
                ];
            });

        // Si aucune transaction trouvée, retourner des exemples (compatibilité front)
        // if ($transactions->isEmpty()) {
        //     $transactions = collect([
        //         ['id' => 1, 'date' => '2025-10-20', 'compte' => 'CPT-001', 'client' => 'Jean Dupont', 'action' => 'Dépôt', 'montant' => 5000, 'solde' => 15000],
        //         ['id' => 2, 'date' => '2025-10-21', 'compte' => 'CPT-002', 'client' => 'Marie Martin', 'action' => 'Retrait', 'montant' => 2000, 'solde' => 8000],
        //     ]);
        // }

        return response()->json($transactions);
    }

    // Données pour la répartition des prêts (chart)
    public function pretsChart()
    {
        try {
            $enCours = 0;
            $payes = 0;
            $impayes = 0;
            if (Schema::hasTable('prets') && Schema::hasColumn('prets', 'statut_pret')) {
                $enCours = Pret::where('statut_pret', 'EN COURS')->count();
                $payes = Pret::where('statut_pret', 'TERMINE')->count();
                $impayes = Pret::where('statut_pret', 'IMPAYE')->count();
            } else {
                $enCours = Pret::count();
            }

            return response()->json([
                ['name' => 'En cours', 'value' => $enCours, 'color' => '#10b981'],
                ['name' => 'Terminés', 'value' => $payes, 'color' => '#22c55e'],
                ['name' => 'Impayés', 'value' => $impayes, 'color' => '#60a5fa'],
            ]);
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }

    // Données pour la répartition des clients (chart)
    public function clientsChart()
    {
        try {
            $total = Client::count();
            $supprimes = 0;
            if (Schema::hasColumn('clients', 'tag')) {
                $supprimes = Client::where('tag', true)->count();
            } elseif (Schema::hasColumn('clients', 'deleted_at')) {
                $supprimes = Client::whereNotNull('deleted_at')->count();
            }

            $actifs = max(0, $total - $supprimes);

            return response()->json([
                ['name' => 'Actifs', 'value' => $actifs, 'color' => '#10b981'],
                ['name' => 'Supprimés', 'value' => $supprimes, 'color' => '#60a5fa'],
            ]);
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }

    // Données d'évolution (ex: dépôts vs retraits par mois)
    public function evolution()
    {
        // Construction d'un jeu de données simple basé sur les transactions si possible
        try {
            $result = [];

            if (Schema::hasTable('transactions') && Schema::hasColumn('transactions', 'date_transaction')) {
                // Regrouper par mois (année présente) pour dépôts/retraits
                // CORRECTION : Utiliser EXTRACT au lieu de MONTH pour PostgreSQL
                $raw = Transaction::selectRaw("EXTRACT(MONTH FROM date_transaction) as m, type_transaction, SUM(CAST(montant_transaction AS DECIMAL(15,2))) as total")
                    ->whereYear('date_transaction', now()->year)
                    ->groupBy('m', 'type_transaction')
                    ->get();

                // mapping mois index to totals
                $map = [];
                foreach ($raw as $r) {
                    // Normaliser le type de transaction (gérer DEPOT/Dépôt/Depot)
                    $type = strtoupper($r->type_transaction);
                    // EXTRACT retourne un float, on le convertit en int
                    $month = (int) $r->m;
                    $map[$month][$type] = (float) $r->total;
                }

                // Construire résultat pour 6 derniers mois
                $now = now();
                $monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

                for ($i = 5; $i >= 0; $i--) {
                    $dt = $now->copy()->subMonths($i);
                    $monthIndex = (int) $dt->format('n') - 1;
                    $label = $monthNames[$monthIndex];
                    $m = (int) $dt->format('n');

                    // Chercher les valeurs avec différentes variantes possibles
                    $depots = $map[$m]['DEPOT'] ?? $map[$m]['DÉPÔT'] ?? $map[$m]['Dépôt'] ?? 0;
                    $retraits = $map[$m]['RETRAIT'] ?? $map[$m]['Retrait'] ?? 0;

                    $result[] = [
                        'mois' => $label,
                        'depots' => $depots,
                        'retraits' => $retraits
                    ];
                }
            }

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to compute evolution',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
