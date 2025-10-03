<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\General;

class JobApplicationAdminNotification extends Notification
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
        $template = General::where('correlative', 'job_application_admin_email')->first();
        $subject = 'Nueva Postulación Laboral Recibida';
        
        // Variables disponibles para la plantilla
        $variables = [
            'applicant_name' => $this->jobApplication->name,
            'applicant_email' => $this->jobApplication->email,
            'applicant_phone' => $this->jobApplication->phone,
            'application_date' => $this->jobApplication->created_at->format('d/m/Y H:i'),
            'cv_link' => url('/assets/resources/' . $this->jobApplication->cv_file),
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
            <h2>Nueva Postulación Laboral</h2>
            <p>Se ha recibido una nueva postulación laboral:</p>
            <ul>
                <li><strong>Nombre:</strong> {{applicant_name}}</li>
                <li><strong>Email:</strong> {{applicant_email}}</li>
                <li><strong>Teléfono:</strong> {{applicant_phone}}</li>
                <li><strong>Fecha:</strong> {{application_date}}</li>
                <li><strong>CV:</strong> <a href="{{cv_link}}">Descargar CV</a></li>
            </ul>
            <p>Por favor, revisa la postulación en el panel de administración.</p>
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
            'cv_link' => 'Link para descargar el CV',
        ];
    }
}
