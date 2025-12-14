<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trace;
use Illuminate\Http\Request;

class TraceController extends Controller
{
    /**
     * Liste des traces avec filtres basiques
     */
    public function index(Request $request)
    {
        $query = Trace::query();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        if ($request->filled('model_type')) {
            $query->where('model_type', $request->input('model_type'));
        }

        if ($request->filled('model_id')) {
            $query->where('model_id', $request->input('model_id'));
        }

        $perPage = (int) $request->input('per_page', 25);

        $results = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($results);
    }

    /**
     * Voir une trace
     */
    public function show($id)
    {
        $trace = Trace::findOrFail($id);
        return response()->json($trace);
    }
}
