<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Exception;
use Spatie\Permission\Models\Role;
use Stichoza\GoogleTranslate\GoogleTranslate;

class ScrapController extends BasicController
{
    /**
     * Traduce una palabra al inglés.
     *
     * @param string $word
     * @return string
     */


    public function scrapNike(Request $request)
    {
        // Debugging: Muestra los datos recibidos en la solicitud

        $traductor = new GoogleTranslate('en');

        // Desactivar la verificación SSL para evitar problemas con cURL
        $traductor->setOptions([
            'verify' => false,
        ]);

        try {
            // Obtener el término de búsqueda y el proveedor
            $query = $request->input('query', 'mujer'); // Usa "mujer" como valor predeterminado
            $proveedor = $request->input('proveedor', 'nike'); // Usa "nike" como valor predeterminado

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
                    dump("Aqui primero", $query);
                    $query = $traductor->translate($query);; // Traduce el término de búsqueda
                    dump($query);
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
                dump($output);
                // Decodificar la salida JSON
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("Error al decodificar JSON: " . json_last_error_msg());
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
            // Registrar el error y devolver una respuesta de error
            dump("Error en scrapNike: " . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
