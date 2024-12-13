<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 6; $i++) {
            $name = 'Marca ' . $i;
            Brand::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'featured' => true
            ]);
        }
    }
}
