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
                'correlative' => 'about-kaori',
                'name' => 'Sobre la fundadora',
                'description' => '✨ Ayudo a mis alumnos a aumentar su *confianza* y *seguridad personal*, hablar en público con soltura y autenticidad, y desarrollar habilidades sociales efectivas.',
            ],
            [
                'correlative' => 'about-trasciende-title',
                'name' => 'Título "sobre trasciende"',
                'description' => 'El Viaje de Trasciende: *Transformando Vidas* y *Desarrollando Potencial*',
            ],
            [
                'correlative' => 'about-trasciende-description',
                'name' => 'Descripción "sobre trasciende"',
                'description' => 'Trasciende nació hace diez años con la misión de ayudar a las personas a descubrir su máximo potencial. Un pequeño grupo de profesionales creó programas de coaching enfocados en el desarrollo personal y profesional, integrando habilidades técnicas y autoconocimiento para transformar vidas.
                Hoy, Trasciende es un referente en crecimiento integral, habiendo impactado a miles de personas a través de sus cursos y talleres. Su enfoque sigue siendo ayudar a cada individuo a alcanzar su mejor versión, expandiéndose a plataformas digitales para llegar a un público global.',
            ],
            [
                'correlative' => 'summary-footer',
                'name' => 'Resúmen footer',
                'description' => '✨ Ayudamos a nuestros alumnos a aumentar su confianza y seguridad personal, hablar en público con soltura y autenticidad, y desarrollar habilidades sociales efectivas.',
            ],
        ];
        Aboutus::whereNotNull('id')->delete();
        foreach ($aboutuses as $aboutus) {
            Aboutus::updateOrCreate(['name' => $aboutus['name']], $aboutus);
        }
    }
}
