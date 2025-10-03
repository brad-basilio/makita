<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\General;

class JobApplicationApplicantNotification extends Notification
{
    use Queueable;

    protected $jobApplication;

    public function __construct($jobApplication)
    {
        $this->jobApplication = $jobApplication;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = General::where('correlative', 'job_application_applicant_email')->first();
        $subject = 'Confirmación de Postulación Recibida';
        
        // Variables disponibles para la plantilla
        $variables = [
            'applicant_name' => $this->jobApplication->name,
            'applicant_email' => $this->jobApplication->email,
            'applicant_phone' => $this->jobApplication->phone,
            'application_date' => $this->jobApplication->created_at->format('d/m/Y H:i'),
        ];

        // Reemplazar variables en la plantilla
        $body = $template ? $template->description : $this->defaultTemplate();
        foreach ($variables as $key => $value) {
            $body = str_replace("{{" . $key . "}}", $value, $body);
        }

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.custom', ['body' => $body]);
    }

    /**
     * Plantilla por defecto si no existe en BD
     */
    private function defaultTemplate()
    {
        return '
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
        ';
    }

    /**
     * Variables disponibles para esta notificación
     */
    public static function availableVariables()
    {
        return [
            'applicant_name' => 'Nombre del postulante',
            'applicant_email' => 'Email del postulante',
            'applicant_phone' => 'Teléfono del postulante',
            'application_date' => 'Fecha de postulación',
        ];
    }
}
