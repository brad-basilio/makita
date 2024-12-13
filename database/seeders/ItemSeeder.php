<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\JSON;
use Illuminate\Support\Str;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i < 20; $i++) {
            $name = 'Producto ' . $i;
            $price = rand(50, 100);
            $discount = rand(50, 100);
            Item::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'summary' => 'Un breve resúmen corto y preciso de ' . $name,
                'description' => 'Aquí una descripción un poco mas larga del ' . $name . '. Esta descripción amplia mas detalles de este producto como información relevante respecto al estado del mismo',
                'featured' => rand(0, 1),
                'recommended' => rand(0, 1),
                'price' => $price,
                'discount' => $discount < $price ? $discount : null,
                'category_id' => Category::all()?->random()?->id,
                'brand_id' => Brand::all()?->random()?->id
            ]);
        }
    }
}
