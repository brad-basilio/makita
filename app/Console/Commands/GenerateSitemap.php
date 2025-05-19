<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Genera el archivo sitemap.xml';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // Rutas principales
        $sitemap->add(Url::create('/')->setPriority(1.0));

        // Agregar rutas desde pages.json
        $this->addPagesFromJson($sitemap);

        // Ejemplo dinámico: productos desde base de datos
        foreach (\App\Models\Item::all() as $product) {
            $sitemap->add(Url::create("/producto/{$product->slug}")
                ->setLastModificationDate($product->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.7));
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('✅ Sitemap generado correctamente en /public/sitemap.xml');
    }

    /**
     * Agrega las páginas definidas en pages.json al sitemap
     */
    private function addPagesFromJson(Sitemap $sitemap)
    {
        if (!Storage::exists('pages.json')) {
            $this->warn('⚠️ El archivo pages.json no existe en storage/app');
            return;
        }

        $pagesJson = Storage::get('pages.json');
        $pages = json_decode($pagesJson, true);

        if (!is_array($pages)) {
            $this->warn('⚠️ El formato del archivo pages.json no es válido');
            return;
        }

        foreach ($pages as $page) {
            // Solo agregar páginas con menuable = true y que tengan una ruta definida
            if (isset($page['menuable']) && $page['menuable'] === true && isset($page['path']) && $page['path'] !== null) {
                $path = $page['path'];
                
                // Usar pseudo_path si está disponible, de lo contrario usar path
                if (isset($page['pseudo_path']) && $page['pseudo_path'] !== null) {
                    $path = $page['pseudo_path'];
                }
                
                // Asegurarse de que la ruta comience con /
                if (!empty($path) && $path !== '/') {
                    $sitemap->add(Url::create($path)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setPriority(0.8));
                    
                    $this->line("Agregada ruta: {$path}");
                }
            }
        }
    }
}
