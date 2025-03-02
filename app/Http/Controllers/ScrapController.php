<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Exception;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Log;

class ScrapController extends BasicController
{
    public function scrapProviders(Request $request)
    {
        $traductor = new GoogleTranslate('en');
        $traductor->setOptions(['verify' => false]);

        try {
            // Obtener el término de búsqueda y el proveedor
            $query = $request->input('query', 'mujer');
            $proveedor = $request->input('proveedor', 'nike');

            // Determinar la ruta del script y el prefijo de caché según el proveedor
            switch ($proveedor) {
                case 'nike':
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
                case 'gapfactory':
                    $dataPath = "gapfactory";
                    $storePath = storage_path('app/scraper/scraper-gapfactory.cjs');
                    break;
                case 'invictastores':
                    $dataPath = "invictastores";
                    $storePath = storage_path('app/scraper/scraper-invictastores.cjs');
                    try {
                        $query = $traductor->translate($query);
                    } catch (Exception $e) {
                        // Si la traducción falla, usa la consulta original
                        $query = $request->input('query', 'mujer');
                    }
                    break;
                case 'sephora':
                    $dataPath = "sephora";
                    $storePath = storage_path('app/scraper/scraper-sephora.cjs');
                    break;
                default:
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
            }

            // Verificar si los datos están en caché
            $cacheKey = "{$dataPath}_products_{$query}";
            $data = Cache::get($cacheKey);

            if (!$data) {
                set_time_limit(60); // Aumenta el tiempo máximo de ejecución

                // Ejecutar Puppeteer con el parámetro
                $command = "node {$storePath} " . escapeshellarg($query);
                $output = shell_exec($command . ' 2>&1');

                if (!$output) {
                    throw new Exception("Error al ejecutar el script de Node.js. Verifica que Node.js esté instalado y que el script funcione correctamente.");
                }

                // Decodificar la salida JSON
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("Error al decodificar JSON: " . json_last_error_msg() . ". Salida del script: " . $output);
                }

                // Guardar los datos en caché durante 1 hora
                Cache::put($cacheKey, $data, now()->addHour());
            }

            // Devolver la respuesta JSON
            return response()->json([
                'status' => 200,
                'message' => 'Operación Correcta. Extraído con Éxito',
                'data' => $data,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function scrap(Request $request)
    {
        $traductor = new GoogleTranslate('en');
        $traductor->setOptions(['verify' => false]);

        try {
            // Parámetros de búsqueda
            $query = $request->input('query', 'mujer');
            $proveedor = $request->input('proveedor', 'nike');
            $page = max(1, intval($request->input('page', 1))); // Página mínima 1
            $limit = max(1, intval($request->input('limit', 12))); // Mínimo 1 producto por página
            $offset = ($page - 1) * $limit;

            // Determinar el script según el proveedor
            switch ($proveedor) {
                case 'nike':
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
                case 'gapfactory':
                    $dataPath = "gapfactory";
                    $storePath = storage_path('app/scraper/scraper-gapfactory.cjs');
                    break;
                case 'invictastores':
                    $dataPath = "invictastores";
                    $storePath = storage_path('app/scraper/scraper-invictastores.cjs');
                    try {
                        $query = $traductor->translate($query);
                    } catch (Exception $e) {
                        $query = $request->input('query', 'mujer');
                    }
                    break;
                case 'sephora':
                    $dataPath = "sephora";
                    $storePath = storage_path('app/scraper/scraper-sephora.cjs');
                    break;
                default:
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
            }

            // Clave de caché con paginación
            $cacheKey = "{$dataPath}_products_{$query}_page_{$page}_limit_{$limit}";
            $data = Cache::get($cacheKey);

            if (!$data) {
                set_time_limit(60); // Evitar timeout en la ejecución

                // Ejecutar Puppeteer con paginación
                $command = "node {$storePath} " . escapeshellarg($query) . " " . escapeshellarg($offset) . " " . escapeshellarg($limit);
                $output = shell_exec($command . ' 2>&1');
                Log::info($output);
                if (!$output) {
                    Log::info("Error al ejecutar el script de Node.js.");
                }

                // Decodificar JSON de la salida
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::info("Error JSON: " . json_last_error_msg() . ". Salida: " . $output);
                }

                // Guardar en caché (1 hora)
                Cache::put($cacheKey, $data, now()->addHour());
            }

            // Retornar datos con paginación
            return response()->json([
                'status' => 200,
                'message' => 'Datos extraídos correctamente',
                'data' => $data,
                'page' => $page,
                'limit' => $limit
            ]);
        } catch (Exception $e) {
            Log::info("Error: " . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error en el scraping',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
