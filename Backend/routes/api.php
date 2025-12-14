<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CompteController;
use App\Http\Controllers\Api\PretController;
use App\Http\Controllers\Api\RembourseController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\TransfertController;
use App\Http\Controllers\MailController;

// Authentification
Route::post('login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);

// Utilisateurs
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [App\Http\Controllers\Api\UserController::class, 'show']);
    Route::put('user', [App\Http\Controllers\Api\UserController::class, 'update']);

    // Comptes
    Route::get('comptes', [App\Http\Controllers\Api\CompteController::class, 'index']);
    Route::get('comptes/{id}', [App\Http\Controllers\Api\CompteController::class, 'show']);
    Route::post('comptes', [App\Http\Controllers\Api\CompteController::class, 'store']);

    // Transactions
    Route::get('transactions', [App\Http\Controllers\Api\TransactionController::class, 'index']);
    Route::post('transactions', [App\Http\Controllers\Api\TransactionController::class, 'store']);

    // Prêts
    Route::get('prets', [App\Http\Controllers\Api\PretController::class, 'index']);
    Route::post('prets', [App\Http\Controllers\Api\PretController::class, 'store']);
    Route::post('prets/{id}/rembourse', [App\Http\Controllers\Api\RembourseController::class, 'store']);

    // Remboursements
    Route::get('remboursements', [App\Http\Controllers\Api\RembourseController::class, 'index']);
});
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::post('/logout', [AuthController::class, 'logout']);

    // --------------------------------------------------------------------
    //              Les Routes accessibles par Admin et Caissier
    // --------------------------------------------------------------------
    Route::middleware('role:admin')->group(function () {
        // Gestion des utilisateurs
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{id}/activate', [UserController::class, 'activate']);
        Route::patch('/users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        // Pour les clients
        Route::post('/clients', [ClientController::class, 'store']);
        Route::put('/clients/{id}', [ClientController::class, 'update']);
        Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
        Route::put('/clients/tag/{id}', [ClientController::class, 'updateTag']);
        Route::put('/client/link-account/{id}/{id_c}', [ClientController::class, 'link_account']);

        // Pour les comptes
        Route::post('/comptes', [CompteController::class, 'store']);
        Route::put('/comptes/{id}', [CompteController::class, 'update']);
        Route::delete('/comptes/{id}', [CompteController::class, 'destroy']);
        Route::put('/comptes/tag/{id}', [CompteController::class, 'updateTag']);
        Route::put('/comptes/active/{id}', [CompteController::class, 'activeCompte']);

        // Pour les transactions
        Route::post('/transactions', [TransactionController::class, 'saveTransaction']);
        Route::get('/transactions/info/{id}', [TransactionController::class, 'getInfoTransaction']);
        // Route::get('/transactions/{id}', [TransactionController::class, 'deleteTransaction']);
        Route::get('/transactions/historiques/', [TransactionController::class, 'getAllHistoriquesTransactions']);
        Route::get('/transactions/historiques/between-two-dates/{startDate}/{endDate}', [TransactionController::class, 'getHistoriquesBetweenTwoDates']);
        Route::get('/transactions/historiques/par-compte/{id}', [TransactionController::class, 'getHistoriquesParCompte']);
        Route::get('/transactions/historiques/par-compte-avant-date/{id}/{date}', [TransactionController::class, 'getHistoriquesParCompteAvantDate']);
        Route::get('/transactions/historiques/par-compte-apres-date/{id}/{date}', [TransactionController::class, 'getHistoriquesParCompteApresDate']);
        Route::get('/transactions/historiques/par-client/{id}', [TransactionController::class, 'getHistoriquesParClient']);
        Route::get('/transactions/historiques/par-client-avant-date/{id}/{date}', [TransactionController::class, 'getHistoriquesParClientAvantDate']);
        Route::get('/transactions/historiques/par-client-apres-date/{id}/{date}', [TransactionController::class, 'getHistoriquesParClientApresDate']);

        // Pour les prêts
        Route::post('/prets', [PretController::class, 'store']);
        Route::put('/prets/{id}', [PretController::class, 'update']);
        Route::delete('/prets/{id}', [PretController::class, 'destroy']);
        Route::get('/prets/entre-deux-dates/{startDate}/{endDate}', [PretController::class, 'getPretEntreDeuxDates']);
        Route::get('/prets/par-client/{clientId}', [PretController::class, 'getPretParClient']);
        Route::get('/prets/par-client/entre-deux-dates/{clientId}/{startDate}/{endDate}', [PretController::class, 'getPretParClientEntreDeuxDates']);
        Route::patch('/prets/approuver/{id}', [PretController::class, 'approuvePret']);

        // Pour les rembourses
        Route::get('/rembourse', [RembourseController::class, 'index']);
        Route::get('/rembourse/{id}', [RembourseController::class, 'show']);
        Route::post('/rembourse', [RembourseController::class, 'store']);
        Route::put('/rembourse/{id}', [RembourseController::class, 'update']);
        Route::delete('/rembourse/{id}', [RembourseController::class, 'delete']);

    });

    // --------------------------------------------------------------------
    //         Les Routes accessibles par Admin et Caissier et Client
    // --------------------------------------------------------------------
    // Pour les clients
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);

    // Pour les comptes
    Route::get('/comptes', [CompteController::class, 'index']);
    Route::get('/comptes/{id}', [CompteController::class, 'show']);

    // Pour les transactions
    Route::get('/transactions', [TransactionController::class, 'getAllTransactions']);

    // Pour les prets
    Route::get('/prets', [PretController::class, 'index']);
    Route::get('/prets/{id}', [PretController::class, 'show']);

    // Pour les transferts
    Route::post('/transferts', [TransfertController::class, 'transfert']);



});

// Routes publiques protégées pour le dashboard admin (auth + role)
Route::get('/admin/stats', [\App\Http\Controllers\Api\AdminDashboardController::class, 'stats'])
    ->middleware(['auth:sanctum', 'role:admin']);
Route::get('/admin/transactions', [\App\Http\Controllers\Api\AdminDashboardController::class, 'transactions'])
    ->middleware(['auth:sanctum', 'role:admin']);
Route::get('/admin/prets', [\App\Http\Controllers\Api\AdminDashboardController::class, 'pretsChart'])
    ->middleware(['auth:sanctum', 'role:admin']);
Route::get('/admin/clients', [\App\Http\Controllers\Api\AdminDashboardController::class, 'clientsChart'])
    ->middleware(['auth:sanctum', 'role:admin']);
Route::get('/admin/evolution', [\App\Http\Controllers\Api\AdminDashboardController::class, 'evolution'])
    ->middleware(['auth:sanctum', 'role:admin']);

Route::get('/send-email', [MailController::class, 'send']);
Route::get('/client/account/{id_c}', [ClientController::class, 'get_client_by_account']);

