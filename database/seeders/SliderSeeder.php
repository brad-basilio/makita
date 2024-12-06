<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sliders = [
            [
                'name' => 'Cursos y Talleres',
                'description' => 'Explora nuestros cursos y talleres especializados en coaching.',
                'bg_image' => 'https://example.com/bg_courses.jpg', // Imagen de fondo para Cursos y Talleres
                'button_text' => 'Ver Cursos',
                'link' => 'https://tupagina.com/cursos',
            ],
            [
                'name' => 'Noticias y Actualizaciones',
                'description' => 'Mantente informado con las últimas noticias y eventos en el mundo del coaching.',
                'bg_image' => 'https://example.com/bg_news.jpg', // Imagen de fondo para Noticias
                'button_text' => 'Ver Noticias',
                'link' => 'https://tupagina.com/noticias',
            ]
        ];

        foreach ($sliders as $slider) {
            Slider::updateOrCreate(
                ['name' => $slider['name']],
                [
                    'name' => $slider['name'],
                    'description' => $slider['description'],
                    'bg_image' => $slider['bg_image'],
                    'button_text' => $slider['button_text'],
                    'button_link' => $slider['link'],
                    'visible' => true,
                    'status' => true,
                ]
            );
        }
    }
}
