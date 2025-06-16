<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServicePoint;

class ServicePointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Distribuidor con sucursales
        ServicePoint::create([
            'type' => 'distributor',
            'name' => 'Sodimac Perú',
            'business_name' => 'Dismac Perú Sociedad Anónima Cerrada',
            'address' => 'Av. Tomás Valle Mza. D Lote 4, Callao, Perú',
            'phones' => '01-123-4567, 01-765-4321',
            'emails' => 'contacto@sodimac.pe, ventas@sodimac.pe',
            'opening_hours' => 'Lunes a Viernes: 8:00-18:00, Sábados: 9:00-15:00',
            'location' => '-12.0464, -77.0428',
            'branches' => [
                [
                    'name' => 'Sucursal Gamarra',
                    'address' => 'Jr. Gamarra 123, La Victoria, Lima',
                    'phones' => '01-111-2222',
                    'emails' => 'gamarra@sodimac.pe',
                    'opening_hours' => 'Lunes a Viernes: 8:00-18:00',
                    'location' => '-12.0697, -77.0161'
                ],
                [
                    'name' => 'Sucursal San Miguel',
                    'address' => 'Av. La Marina 2355, San Miguel, Lima',
                    'phones' => '01-333-4444',
                    'emails' => 'sanmiguel@sodimac.pe',
                    'opening_hours' => 'Lunes a Sábado: 9:00-19:00',
                    'location' => '-12.0776, -77.0918'
                ]
            ],
            'status' => true,
            'visible' => true
        ]);

        // Red de servicio técnico
        ServicePoint::create([
            'type' => 'service_network',
            'name' => 'Servicio Técnico Power Tools',
            'address' => 'Av. República de Panamá 3505, San Isidro, Lima',
            'phones' => '01-555-6666',
            'emails' => 'servicio@powertools.pe',
            'opening_hours' => 'Lunes a Viernes: 8:30-17:30',
            'location' => '-12.0969, -77.0371',
            'branches' => [
                [
                    'name' => 'Taller Miraflores',
                    'address' => 'Av. Benavides 1180, Miraflores, Lima',
                    'phones' => '01-777-8888',
                    'emails' => 'miraflores@powertools.pe',
                    'opening_hours' => 'Lunes a Viernes: 9:00-18:00',
                    'location' => '-12.1267, -77.0288'
                ]
            ],
            'status' => true,
            'visible' => true
        ]);

        // Distribuidor sin sucursales
        ServicePoint::create([
            'type' => 'distributor',
            'name' => 'Ferretería Industrial SAC',
            'business_name' => 'Ferretería Industrial Sociedad Anónima Cerrada',
            'address' => 'Jr. Paruro 879, Cercado de Lima',
            'phones' => '01-999-0000',
            'emails' => 'ventas@ferreteriaind.pe',
            'opening_hours' => 'Lunes a Sábado: 8:00-17:00',
            'location' => '-12.0583, -77.0323',
            'branches' => null,
            'status' => true,
            'visible' => true
        ]);
    }
}
