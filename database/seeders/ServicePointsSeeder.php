<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Commands\Seed\SeedCommand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServicePointsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Limpiar tabla antes de insertar
        DB::table('service_points')->truncate();

        // Datos de ejemplo para distribuidores
        $distributors = [
            [
                'id' => 'b50b033a-85bc-11f0-9afd-60ff9e6c2e61',
                'name' => 'Distribuidor Central Lima',
                'business_name' => 'Distribuidora Makita Lima S.A.C.',
                'type' => 'distributor',
                'address' => 'Av. Argentina 1234, Lima, Perú',
                'location' => '-12.0464, -77.0428',
                'phones' => '01-234-5678, 01-234-5679',
                'emails' => 'lima@makita.com.pe, ventas.lima@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 8:00 AM - 1:00 PM\nDomingos: Cerrado",
                'branches' => json_encode([
                    [
                        'name' => 'Sucursal San Isidro',
                        'address' => 'Av. Javier Prado 456, San Isidro',
                        'location' => '-12.0969, -76.9961',
                        'phones' => '01-345-6789',
                        'emails' => 'sanisidro@makita.com.pe',
                        'opening_hours' => 'Lunes a Viernes: 9:00 AM - 5:00 PM'
                    ]
                ]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Distribuidor Norte Trujillo',
                'business_name' => 'Ferretería Norte E.I.R.L.',
                'type' => 'distributor',
                'address' => 'Av. España 789, Trujillo, La Libertad',
                'location' => '-8.1116, -79.0287',
                'phones' => '044-123-456, 044-123-457',
                'emails' => 'trujillo@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 8:30 AM - 5:30 PM\nSábados: 9:00 AM - 12:00 PM",
                'branches' => json_encode([]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Distribuidor Sur Arequipa',
                'business_name' => 'Comercial Arequipa S.R.L.',
                'type' => 'distributor',
                'address' => 'Av. Dolores 321, Arequipa',
                'location' => '-16.4090, -71.5375',
                'phones' => '054-987-654',
                'emails' => 'arequipa@makita.com.pe, soporte.arequipa@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 8:00 AM - 2:00 PM",
                'branches' => json_encode([
                    [
                        'name' => 'Sucursal Cayma',
                        'address' => 'Av. Cayma 123, Cayma, Arequipa',
                        'location' => '-16.3667, -71.5500',
                        'phones' => '054-111-222',
                        'emails' => 'cayma@makita.com.pe',
                        'opening_hours' => 'Lunes a Viernes: 9:00 AM - 4:00 PM'
                    ],
                    [
                        'name' => 'Sucursal Cerro Colorado',
                        'address' => 'Av. Aviación 567, Cerro Colorado, Arequipa',
                        'location' => '-16.4167, -71.5833',
                        'phones' => '054-333-444',
                        'emails' => 'cerrocolorado@makita.com.pe',
                        'opening_hours' => 'Lunes a Sábado: 8:00 AM - 5:00 PM'
                    ]
                ]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        // Datos de ejemplo para centros de servicio
        $serviceNetworks = [
            [
                'id' => Str::uuid(),
                'name' => 'Centro de Servicio Técnico Lima Centro',
                'business_name' => 'Servicio Técnico Makita Lima S.A.C.',
                'type' => 'service_network',
                'address' => 'Jr. Lampa 890, Cercado de Lima',
                'location' => '-12.0432, -77.0282',
                'phones' => '01-456-7890, 01-456-7891',
                'emails' => 'servicio.lima@makita.com.pe, reparaciones@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 7:30 AM - 6:30 PM\nSábados: 8:00 AM - 3:00 PM\nDomingos: Cerrado",
                'branches' => json_encode([]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Servicio Técnico Miraflores',
                'business_name' => 'Taller Miraflores E.I.R.L.',
                'type' => 'service_network',
                'address' => 'Av. Larco 1234, Miraflores, Lima',
                'location' => '-12.1198, -77.0280',
                'phones' => '01-567-8901',
                'emails' => 'miraflores.servicio@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 1:00 PM",
                'branches' => json_encode([
                    [
                        'name' => 'Taller Especializado',
                        'address' => 'Calle Los Pinos 456, Miraflores',
                        'location' => '-12.1250, -77.0300',
                        'phones' => '01-678-9012',
                        'emails' => 'taller.miraflores@makita.com.pe',
                        'opening_hours' => 'Lunes a Viernes: 8:00 AM - 5:00 PM'
                    ]
                ]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Centro de Servicio Cusco',
                'business_name' => 'Servicio Técnico Cusco S.R.L.',
                'type' => 'service_network',
                'address' => 'Av. El Sol 567, Cusco',
                'location' => '-13.5319, -71.9675',
                'phones' => '084-234-567, 084-234-568',
                'emails' => 'cusco.servicio@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 8:00 AM - 5:00 PM\nSábados: 8:00 AM - 12:00 PM",
                'branches' => json_encode([]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Servicio Técnico Piura',
                'business_name' => 'Reparaciones Piura E.I.R.L.',
                'type' => 'service_network',
                'address' => 'Av. Grau 890, Piura',
                'location' => '-5.1945, -80.6328',
                'phones' => '073-345-678',
                'emails' => 'piura.servicio@makita.com.pe, soporte.piura@makita.com.pe',
                'opening_hours' => "Lunes a Viernes: 8:30 AM - 5:30 PM\nSábados: 9:00 AM - 1:00 PM",
                'branches' => json_encode([]),
                'status' => true,
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        // Insertar distribuidores
        foreach ($distributors as $distributor) {
            DB::table('service_points')->insert($distributor);
        }

        // Insertar centros de servicio
        foreach ($serviceNetworks as $serviceNetwork) {
            DB::table('service_points')->insert($serviceNetwork);
        }

        $this->command->info('ServicePoints seeder completed successfully!');
        $this->command->info('Created ' . count($distributors) . ' distributors and ' . count($serviceNetworks) . ' service networks.');
    }
}