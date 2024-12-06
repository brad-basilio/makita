<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\JSON;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'id' => '1a5e9f73-4174-4930-9c19-0a63e5a3d8ff',
                'name' => 'Coaching de Liderazgo',
                'summary' => 'Mejora tus habilidades de liderazgo con técnicas de coaching.',
                'description' => 'Este curso enseña habilidades de liderazgo basadas en coaching para mejorar la comunicación y la resolución de conflictos.',
                'sessions' => '8',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 2,
                'long_duration' => 64,
                'price' => 1500.00,
                'discount' => 200.00,
                'students' => 50,
                'image' => 'leadership_coaching.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => true,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => 'b376fb1b-6f36-47e7-a00d-223f17ad435e',
                'name' => 'Mentoría en el Ámbito Profesional',
                'summary' => 'Un curso para convertirse en mentor profesional.',
                'description' => 'Aprende cómo guiar a otros en su desarrollo profesional mediante técnicas de mentoría.',
                'sessions' => '6',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 2,
                'long_duration' => 48,
                'price' => 1200.00,
                'discount' => 100.00,
                'students' => 35,
                'image' => 'mentoring_professional.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => true,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => '0a2a542d-f14f-46c2-88d6-3a3a9f8ddab1',
                'name' => 'Coaching Personal para el Desarrollo Individual',
                'summary' => 'Mejora tu desarrollo personal con técnicas de coaching.',
                'description' => 'Un curso centrado en el crecimiento personal a través del coaching individual.',
                'sessions' => '10',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 3,
                'long_duration' => 80,
                'price' => 1800.00,
                'discount' => 300.00,
                'students' => 40,
                'image' => 'personal_coaching.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => false,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => '3d934b45-4958-4c63-9c7b-bfb7b1ad8d08',
                'name' => 'Mentoría para Startups',
                'summary' => 'Guiar a startups en su crecimiento inicial.',
                'description' => 'Este curso capacita a mentores para ayudar a startups a crecer y enfrentarse a los desafíos iniciales.',
                'sessions' => '12',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 4,
                'long_duration' => 96,
                'price' => 2500.00,
                'discount' => 500.00,
                'students' => 20,
                'image' => 'startup_mentoring.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => true,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => '53bba33f-546e-4d7b-b574-83985f527305',
                'name' => 'Coaching para el Éxito Empresarial',
                'summary' => 'Mejora el rendimiento empresarial con coaching.',
                'description' => 'Este curso está diseñado para gerentes que desean mejorar el éxito de su empresa mediante coaching empresarial.',
                'sessions' => '10',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 3,
                'long_duration' => 72,
                'price' => 2200.00,
                'discount' => 400.00,
                'students' => 30,
                'image' => 'business_success_coaching.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => true,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => '75bf3241-5189-413e-bde3-8f24859d91e1',
                'name' => 'Mentoría para el Crecimiento Profesional',
                'summary' => 'Ayuda a profesionales a crecer en su carrera.',
                'description' => 'Un curso para aprender a guiar a otros en el crecimiento profesional, a través de mentoría.',
                'sessions' => '7',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 2 ,
                'long_duration' => 56,
                'price' => 1400.00,
                'discount' => 150.00,
                'students' => 45,
                'image' => 'career_growth_mentoring.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => false,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => 'fb8a9531-8c5e-4f4e-9ae4-9d89210cc208',
                'name' => 'Coaching Ejecutivo',
                'summary' => 'Desarrollo de habilidades ejecutivas mediante coaching.',
                'description' => 'Este curso enseña cómo aplicar coaching para mejorar las habilidades ejecutivas en entornos corporativos.',
                'sessions' => '9',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 3,
                'long_duration' => 78,
                'price' => 2400.00,
                'discount' => 350.00,
                'students' => 25,
                'image' => 'executive_coaching.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => true,
                'visible' => true,
                'status' => true,
            ],
            [
                'id' => 'f2134097-42b2-40ad-847b-bd9946af3680',
                'name' => 'Mentoría para Jóvenes Profesionales',
                'summary' => 'Ayuda a jóvenes profesionales a desarrollar sus carreras.',
                'description' => 'Este curso proporciona herramientas para mentores que desean ayudar a jóvenes profesionales a avanzar en sus carreras.',
                'sessions' => '5',
                'certificate' => 'Físico y Virtual PDF',
                'session_duration' => 1,
                'long_duration' => 40,
                'price' => 1000.00,
                'discount' => 100.00,
                'students' => 15,
                'image' => 'young_professional_mentoring.jpg',
                'audience' => JSON::stringify(['Mentores y jóvenes profesionales.']),
                'requirements' => JSON::stringify(['Experiencia mínima en el campo profesional.']),
                'objectives' => JSON::stringify(['Ayudar a los jóvenes profesionales a desarrollarse.']),
                'content' => JSON::stringify([
                    ['text' => 'Planificación de carrera'],
                    ['text' => 'orientación profesional'],
                    ['text' => 'técnicas de mentoría.']
                ]),
                'featured' => false,
                'visible' => true,
                'status' => true,
            ],
        ];

        $categories = [
            'Crecimiento Personal',
            'Desarrollo Profesional',
            'Transformación Integral',
        ];

        foreach ($items as $item) {
            $item['category_id'] = Category::where('name', $categories[array_rand($categories)])->first()->id;
            Item::updateOrCreate(['id' => $item['id']], $item);
        }
    }
}
