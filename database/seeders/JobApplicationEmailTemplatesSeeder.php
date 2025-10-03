<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General;

class JobApplicationEmailTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Template para email al postulante
        General::updateOrCreate(
            ['correlative' => 'job_application_applicant_email'],
            [
                'name' => 'Email de Confirmación al Postulante',
                'description' => '
                    <h2>¡Gracias por tu postulación!</h2>
                    <p>Hola <strong>{{applicant_name}}</strong>,</p>
                    <p>Hemos recibido tu postulación correctamente el día <strong>{{application_date}}</strong>.</p>
                    <p>Tu información de contacto:</p>
                    <ul>
                        <li>Email: {{applicant_email}}</li>
                        <li>Teléfono: {{applicant_phone}}</li>
                    </ul>
                    <p>Nuestro equipo de recursos humanos revisará tu CV y nos pondremos en contacto contigo pronto.</p>
                    <p>Saludos cordiales,<br>Equipo de Recursos Humanos</p>
                '
            ]
        );

        // Template para email al administrador
        General::updateOrCreate(
            ['correlative' => 'job_application_admin_email'],
            [
                'name' => 'Email de Notificación al Administrador',
                'description' => '
                    <h2>Nueva Postulación Laboral</h2>
                    <p>Se ha recibido una nueva postulación laboral:</p>
                    <ul>
                        <li><strong>Nombre:</strong> {{applicant_name}}</li>
                        <li><strong>Email:</strong> {{applicant_email}}</li>
                        <li><strong>Teléfono:</strong> {{applicant_phone}}</li>
                        <li><strong>Fecha:</strong> {{application_date}}</li>
                        <li><strong>CV:</strong> <a href="{{cv_link}}" style="color: #007bff; text-decoration: none;">Descargar CV</a></li>
                    </ul>
                    <p>Por favor, revisa la postulación en el panel de administración.</p>
                '
            ]
        );

        // Correo corporativo por defecto (vacío para que el admin lo configure)
        General::updateOrCreate(
            ['correlative' => 'corporate_email'],
            [
                'name' => 'Correo Corporativo',
                'description' => ''
            ]
        );
    }
}
