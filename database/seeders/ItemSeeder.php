<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\ItemSpecification;
use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\JSON;
use Illuminate\Support\Str;
use SoDe\Extend\Math;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i < 20; $i++) {
            $name = 'Producto ' . $i;
            $price = Math::floor(rand(100, 200) / 5) * 5;
            $discount = Math::floor(rand(50, 150) / 5) * 5;
            $final_price = $price;
            if ($discount < $price) {
                $final_price = $discount;
            }

            $item = Item::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'summary' => 'Un breve resúmen corto y preciso de ' . $name,
                'description' => 'Aquí una descripción un poco mas larga del ' . $name . '. Esta descripción amplia mas detalles de este producto como información relevante respecto al estado del mismo',
                'featured' => rand(0, 1),
                'recommended' => rand(0, 1),
                'price' => $price,
                'discount' => $discount < $price ? $discount : null,
                'final_price' => $final_price,
                'discount_percent' => 100 - ($final_price / $price * 100),
                'category_id' => Category::all()?->random()?->id,
                'brand_id' => Brand::all()?->random()?->id
            ]);

            // Agregar especificaciones técnicas de ejemplo
            $this->createTechnicalSpecifications($item, $i);
        }
    }

    /**
     * Crear especificaciones técnicas de ejemplo para un producto
     */
    private function createTechnicalSpecifications(Item $item, int $index): void
    {
        $specifications = [
             [
                 'type' => 'technical',
                 'title' => 'Tensión nominal de la batería',
                 'description' => rand(1, 3) == 1 ? '12 V' : (rand(1, 2) == 1 ? '18 V' : '40 V')
             ],
             [
                 'type' => 'technical',
                 'title' => 'Capacidad de la batería',
                 'description' => rand(1, 4) == 1 ? '2,0 Ah' : (rand(1, 3) == 1 ? '4,0 Ah' : (rand(1, 2) == 1 ? '6,0 Ah' : '8,0 Ah'))
             ],
             [
                 'type' => 'technical',
                 'title' => 'Peso de la herramienta con batería',
                 'description' => (rand(10, 50) / 10) . ' kg'
             ],
             [
                 'type' => 'technical',
                 'title' => 'Dimensiones de producto (L x W x H)',
                 'description' => rand(200, 1000) . ' x ' . rand(100, 300) . ' x ' . rand(100, 400) . ' mm'
             ],
             [
                 'type' => 'technical',
                 'title' => 'Nivel de presión sonora (LpA)',
                 'description' => rand(50, 90) . ' dB(A)'
             ],
             [
                 'type' => 'technical',
                 'title' => 'Volumen de aire',
                 'description' => (rand(5, 30) / 10) . ' m³/min'
             ],
             [
                 'type' => 'technical',
                 'title' => 'Capacidad del depósito para polvo',
                 'description' => (rand(3, 15) / 10) . ' L'
             ],
             [
                 'type' => 'technical',
                 'title' => 'Máx. sellado de succión',
                 'description' => rand(30, 100) . ' mbar'
             ],
             [
                 'type' => 'technical',
                 'title' => 'Potencia de succión',
                 'description' => rand(100, 500) . ' W'
             ]
         ];

        // Crear entre 3 y 6 especificaciones aleatorias para cada producto
        $numSpecs = rand(3, 6);
        $selectedSpecs = array_rand($specifications, $numSpecs);
        
        if (!is_array($selectedSpecs)) {
            $selectedSpecs = [$selectedSpecs];
        }

        foreach ($selectedSpecs as $specIndex) {
            ItemSpecification::create([
                'item_id' => $item->id,
                'type' => $specifications[$specIndex]['type'],
                'title' => $specifications[$specIndex]['title'],
                'description' => $specifications[$specIndex]['description']
            ]);
        }
    }
}
