<?php

namespace Database\Seeders;

use App\Models\General;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GeneralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $generalData = [
            [
                'correlative' => 'phone_contact',
                'name' => 'Teléfono de contacto',
                'description' => '+51 945 622 983'
            ],
            [
                'correlative' => 'email_contact',
                'name' => 'Correo de contacto',
                'description' => 'soporte@trasciende.com'
            ],
            [
                'correlative' => 'address',
                'name' => 'Dirección',
                'description' => 'Calle Nicanor Rocca de Vergallo 493, Magdalena del Mar Lima -Perú'
            ],
            [
                'correlative' => 'opening_hours',
                'name' => 'Horarios de atención',
                'description' => 'De lunes a viernes - 10 am a 7pm'
            ],
            [
                'correlative' => 'support_phone',
                'name' => 'Número de soporte',
                'description' => '+51 945 622 983'
            ],
            [
                'correlative' => 'support_email',
                'name' => 'Correo de soporte',
                'description' => 'soporte@trasciende.com'
            ],
            [
                'correlative' => 'privacy_policy',
                'name' => 'Política de privacidad',
                'description' => 'Nuestra política de privacidad protege la información personal de nuestros usuarios...'
            ],
            [
                'correlative' => 'terms_conditions',
                'name' => 'Términos y condiciones',
                'description' => 'Al usar nuestros servicios, usted acepta los siguientes términos y condiciones...'
            ],
            [
                'correlative' => 'location',
                'name' => 'Ubicación',
                'description' => '-12.097029,-77.037251'
            ]
        ];

        foreach ($generalData as $data) {
            General::updateOrCreate(
                ['correlative' => $data['correlative']],
                [
                    'name' => $data['name'],
                    'description' => $data['description']
                ]
            );
        }
    }
}
