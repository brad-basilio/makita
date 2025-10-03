<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\General;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\Response;
use App\Notifications\JobApplicationApplicantNotification;
use App\Notifications\JobApplicationAdminNotification;

class JobApplicationController extends BasicController
{
    public $model = JobApplication::class;
    public $reactView = 'Admin/JobApplications';
    public $imageFields = ['cv_file'];

    /**
     * Se ejecuta después de crear/actualizar la postulación
     * Envía emails en paralelo al postulante y al administrador
     */
    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        // Solo enviar emails si es una nueva postulación (no edición desde admin)
        if (!$isNew) {
            return null;
        }

        try {
            // 1. Email de confirmación al postulante
            Notification::route('mail', $jpa->email)
                ->notify(new JobApplicationApplicantNotification($jpa));
            
            // 2. Email de notificación al administrador
            $corporateEmail = General::where('correlative', 'corporate_email')->first();
            if ($corporateEmail && $corporateEmail->description) {
                Notification::route('mail', $corporateEmail->description)
                    ->notify(new JobApplicationAdminNotification($jpa));
            }
        } catch (\Throwable $th) {
            // Log error pero no fallar la operación
            Log::error('Error enviando emails de postulación: ' . $th->getMessage());
        }

        return 'Postulación enviada correctamente. Revisa tu correo electrónico.';
    }
}

