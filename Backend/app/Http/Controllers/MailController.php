<?php

namespace App\Http\Controllers;

use App\Mail\sendMailMicrofinance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    //
    public function send()
    {

        try {
            //code...
            $data = [
                'title' => 'Bonjour avec Laravel 11',
                'body' => 'Ceci est un email de test envoyé avec Laravel 11.'
            ];

            Mail::to('herilantodenis@gmail.com')->send(new sendMailMicrofinance($data));

            return "Email envoyé avec succès ✅";
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 400);
        }
    }
}
