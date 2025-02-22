<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Exception;
use Stichoza\GoogleTranslate\GoogleTranslate;

class ScrapController extends BasicController
{
    public function scrapNike(Request $request)
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
}
