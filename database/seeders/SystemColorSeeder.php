<?php

namespace Database\Seeders;

use App\Models\SystemColor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            [
                'name' => 'primary',
                'description' => '#333333',
            ],
            [
                'name' => 'secondary',
                'description' => '#0866ff',
            ],
            [
                'name' => 'extracolor',
                'description' => '#42b72a',
            ]
        ];

        SystemColor::truncate();
        foreach ($colors as $color) {
            SystemColor::updateOrCreate(['name' => $color['name']], $color);
        }
    }
}
