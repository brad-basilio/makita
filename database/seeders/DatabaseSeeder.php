<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UsersSeeder::class,
            SliderSeeder::class,
            IndicatorSeeder::class,
            AboutusSeeder::class,
            TestimonySeeder::class,
            CategorySeeder::class,
            SubCategorySeeder::class,
            BrandSeeder::class,
            StrengthSeeder::class,
            SocialSeeder::class,
            GeneralSeeder::class,
            ItemSeeder::class,
            SystemSeeder::class,
        ]);
    }
}
