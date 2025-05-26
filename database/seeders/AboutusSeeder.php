<?php

namespace Database\Seeders;

use App\Models\Aboutus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutuses = [
            [
                'correlative' => 'sala-falabella',
                'name' => 'Logo 1',
                'description' => 'Sala Falabella',
                'title' => '',
            ],
            [
                'correlative' => 'mercado-libre',
                'name' => 'Logo 2',
                'description' => 'Mercado Libre',
                'title' => '',

            ],
            [
                'correlative' => 'ripley',
                'name' => 'Logo 3',
                'description' => 'Ripley',
                'title' => '',

            ],
        ];
        Aboutus::whereNotNull('id')->delete();
        foreach ($aboutuses as $aboutus) {
            Aboutus::updateOrCreate(['name' => $aboutus['name']], $aboutus);
        }
    }
}
