<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Affiche le profil utilisateur connecté
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Met à jour le profil utilisateur connecté
    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->only(['name', 'email']);
        $user->update($data);
        return response()->json($user);
    }
}
