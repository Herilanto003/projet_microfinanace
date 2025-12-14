<?php

namespace App\Observers;

use App\Models\Trace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditObserver
{
    // Limites pour éviter d'encoder de très gros payloads
    protected int $maxStringLength = 1000;
    protected int $maxKeys = 50;
    protected array $blacklist = [
        'password',
        'remember_token',
        'token',
        'api_token',
        'photo',
        'file',
        'blob',
        'avatar'
    ];

    protected function makeTrace(Model $model, string $action)
    {
        $userId = null;
        try {
            $userId = Auth::id();
        } catch (\Throwable $e) {
            $userId = null;
        }

        $old = null;
        $new = null;

        if ($action === 'ajout') {
            $raw = $model->getAttributes();
            $new = $this->sanitizeValues($raw);
        } elseif ($action === 'mise_a_jour') {
            // ne prendre que les attributs modifiés pour réduire le volume
            $changes = $model->getChanges();
            if (empty($changes)) {
                // rien à tracer
                return;
            }
            $oldRaw = [];
            foreach (array_keys($changes) as $k) {
                $oldRaw[$k] = $model->getOriginal($k);
            }
            $old = $this->sanitizeValues($oldRaw);
            $new = $this->sanitizeValues($changes);
        } elseif ($action === 'suppression') {
            $raw = $model->getOriginal();
            $old = $this->sanitizeValues($raw);
        }

        // Insérer via Eloquent; les valeurs JSON ont été nettoyées/tronquées
        Trace::create([
            'user_id' => $userId,
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => (string) $model->getKey(),
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'ip' => Request::ip(),
            'user_agent' => Request::header('User-Agent'),
        ]);
    }

    /**
     * Nettoie et tronque les valeurs pour éviter les payloads volumineux
     * - supprime les champs en blacklist
     * - tronque les chaînes trop longues
     * - remplace les contenus binaires
     * - limite le nombre de clés
     */
    protected function sanitizeValues(array $values, int $depth = 0)
    {
        $result = [];
        $count = 0;

        foreach ($values as $key => $value) {
            if ($count >= $this->maxKeys) {
                break;
            }

            if (in_array($key, $this->blacklist, true)) {
                $result[$key] = '[filtered]';
                $count++;
                continue;
            }

            // éviter les relations et objets lourds
            if (is_object($value) || is_resource($value)) {
                $result[$key] = '[object]';
                $count++;
                continue;
            }

            if (is_array($value)) {
                // limiter la profondeur
                if ($depth >= 2) {
                    $result[$key] = '[array]';
                } else {
                    $result[$key] = $this->sanitizeValues($value, $depth + 1);
                }
                $count++;
                continue;
            }

            // scalar values
            if (is_string($value)) {
                // détecter contenu binaire
                if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $value)) {
                    $result[$key] = '[binary]';
                    $count++;
                    continue;
                }

                $trimmed = trim($value);
                if (mb_strlen($trimmed) > $this->maxStringLength) {
                    $result[$key] = mb_substr($trimmed, 0, $this->maxStringLength) . '... (truncated)';
                } else {
                    $result[$key] = $trimmed;
                }
                $count++;
                continue;
            }

            // bool/int/float/null
            $result[$key] = $value;
            $count++;
        }

        return $result;
    }

    public function created(Model $model)
    {
        $this->makeTrace($model, 'ajout');
    }

    public function updated(Model $model)
    {
        $this->makeTrace($model, 'mise_a_jour');
    }

    public function deleted(Model $model)
    {
        $this->makeTrace($model, 'suppression');
    }
}
