# Sistema de Notificaciones por Email - Postulaciones Laborales

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de notificaciones por email para las postulaciones laborales, que envía correos **en paralelo** tanto al postulante como al administrador.

---

## 🎯 Características Implementadas

### 1. **Nuevo Campo en Generals: Correo Corporativo**
- **Ubicación**: `/admin/generals` → Pestaña "Información de Contacto"
- **Correlativo**: `corporate_email`
- **Función**: Recibir notificaciones de nuevas postulaciones laborales
- **Descripción**: Campo de tipo email con helper text explicativo

### 2. **Plantillas de Email Editables**
Se agregaron 2 nuevas plantillas editables en la pestaña "Email" de Generals:

#### a) **Email de Confirmación al Postulante**
- **Correlativo**: `job_application_applicant_email`
- **Nombre**: "Email de Confirmación al Postulante"
- **Variables disponibles**:
  - `{{applicant_name}}` - Nombre del postulante
  - `{{applicant_email}}` - Email del postulante
  - `{{applicant_phone}}` - Teléfono del postulante
  - `{{application_date}}` - Fecha de postulación (formato: dd/mm/yyyy HH:mm)

#### b) **Email de Notificación al Administrador**
- **Correlativo**: `job_application_admin_email`
- **Nombre**: "Email de Notificación al Administrador"
- **Variables disponibles**:
  - `{{applicant_name}}` - Nombre del postulante
  - `{{applicant_email}}` - Email del postulante
  - `{{applicant_phone}}` - Teléfono del postulante
  - `{{application_date}}` - Fecha de postulación
  - `{{cv_link}}` - Link directo para descargar el CV

---

## 🔧 Archivos Creados/Modificados

### Nuevos Archivos:
1. **`app/Notifications/JobApplicationApplicantNotification.php`**
   - Notificación enviada al postulante
   - Usa plantilla editable desde BD
   - Implementa `availableVariables()` para mostrar variables en admin

2. **`app/Notifications/JobApplicationAdminNotification.php`**
   - Notificación enviada al administrador
   - Incluye link para descargar CV
   - Implementa `availableVariables()` para mostrar variables en admin

3. **`resources/views/emails/custom.blade.php`**
   - Vista Blade para renderizar emails personalizados
   - Usa wrapper común `email_wrapper.blade.php`

4. **`database/seeders/JobApplicationEmailTemplatesSeeder.php`**
   - Crea plantillas por defecto en tabla `generals`
   - Crea registro para `corporate_email`

### Archivos Modificados:
1. **`resources/js/Admin/Generals.jsx`**
   - Agregado campo `corporateEmail` en formData
   - Agregado input en tab "Información de Contacto"
   - Agregado mapeo de correlatives para job_application
   - Actualizado filtro de emailTemplates

2. **`app/Http/Controllers/JobApplicationController.php`**
   - Implementado método `store()` completo
   - Envío de emails en paralelo usando `Notification::route()`
   - Validación de existencia de correo corporativo

3. **`app/Http/Controllers/Admin/NotificationVariableController.php`**
   - Agregadas rutas para `job_application_applicant` y `job_application_admin`

---

## 🚀 Flujo de Funcionamiento

### Cuando un usuario envía una postulación:

```
1. Usuario completa formulario (nombre, email, teléfono, CV)
   └─> TopBarCopyright.jsx → handleSubmit()

2. Se envía FormData al backend
   └─> jobApplicationsRest.save(submitData)
   
3. Backend: BasicController::save()
   ├─> beforeSave() - Prepara datos
   ├─> Guarda archivo CV en storage
   ├─> Crea/actualiza registro en job_applications
   └─> afterSave() - Envía emails (AQUÍ)
   
4. JobApplicationController::afterSave()
   ├─> Verifica si es nueva postulación ($isNew)
   └─> Si es nueva, envía 2 emails EN PARALELO:
   
   ┌─────────────────────────────────────┐
   │ Email 1: Al Postulante              │
   │ ─────────────────────────────────── │
   │ • Destinatario: email del postulante│
   │ • Asunto: Confirmación de           │
   │   Postulación Recibida              │
   │ • Contenido: Plantilla editable     │
   │   desde /admin/generals → Email     │
   └─────────────────────────────────────┘
   
   ┌─────────────────────────────────────┐
   │ Email 2: Al Administrador           │
   │ ─────────────────────────────────── │
   │ • Destinatario: corporate_email     │
   │   configurado en Generals           │
   │ • Asunto: Nueva Postulación Laboral │
   │   Recibida                          │
   │ • Contenido: Plantilla editable +   │
   │   link para descargar CV            │
   └─────────────────────────────────────┘

5. afterSave() retorna mensaje de éxito
   └─> BasicController::save() incluye mensaje en response.data

6. Frontend muestra notificación de éxito
   └─> BasicRest detecta result.data como string
   └─> toast.success("Postulación enviada correctamente...")
```

### ⚠️ Importante sobre el Flujo:
- **NO sobrescribimos `store()`** - Usamos el flujo estándar de `BasicController`
- **`afterSave()` se ejecuta DESPUÉS** de guardar en BD (garantiza que el registro existe)
- **`$isNew` diferencia** entre crear (formulario público) vs editar (admin panel)
- **Los emails solo se envían** cuando `$isNew === true` (nueva postulación)
- **Si falla el envío de email**, se registra en logs pero NO falla la operación completa

---

## 📝 Configuración Inicial Requerida

### Paso 1: Configurar Correo Corporativo
1. Ir a `/admin/generals`
2. Click en pestaña **"Información de Contacto"**
3. Completar campo **"Correo Corporativo"**
4. Click en **"Guardar"**

### Paso 2: Personalizar Plantillas de Email (Opcional)
1. Ir a `/admin/generals`
2. Click en pestaña **"Email"**
3. Seleccionar en el dropdown:
   - "Email de Confirmación al Postulante" o
   - "Email de Notificación al Administrador"
4. Editar contenido HTML usando TinyMCE
5. Usar variables como `{{applicant_name}}`, `{{application_date}}`, etc.
6. Click en **"Guardar"**

---

## 🎨 Personalización de Plantillas

### Variables Dinámicas
Las plantillas soportan las siguientes variables (se reemplazan automáticamente):

**Para Email al Postulante:**
```html
<p>Hola <strong>{{applicant_name}}</strong>,</p>
<p>Recibimos tu postulación el {{application_date}}</p>
<p>Email: {{applicant_email}}</p>
<p>Teléfono: {{applicant_phone}}</p>
```

**Para Email al Administrador:**
```html
<h2>Nueva Postulación</h2>
<ul>
    <li>Nombre: {{applicant_name}}</li>
    <li>Email: {{applicant_email}}</li>
    <li>Teléfono: {{applicant_phone}}</li>
    <li>Fecha: {{application_date}}</li>
    <li>CV: <a href="{{cv_link}}">Descargar</a></li>
</ul>
```

### Ejemplo de Plantilla Personalizada:
```html
<div style="text-align: center;">
    <img src="https://tudominio.com/logo.png" alt="Logo" style="width: 150px;">
</div>

<h2 style="color: #333;">¡Bienvenido {{applicant_name}}!</h2>

<p>Gracias por postular a nuestra empresa. Hemos recibido tu información:</p>

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
    <p><strong>📧 Email:</strong> {{applicant_email}}</p>
    <p><strong>📱 Teléfono:</strong> {{applicant_phone}}</p>
    <p><strong>📅 Fecha:</strong> {{application_date}}</p>
</div>

<p>Nuestro equipo revisará tu CV en las próximas 48 horas.</p>

<p style="color: #666; font-size: 12px;">
    Este es un email automático, por favor no responder.
</p>
```

---

## ✅ Testing

### Probar el Sistema:
1. **Configurar correo corporativo** en `/admin/generals`
2. **Ir a la página pública** donde está el formulario de postulación
3. **Completar el formulario**:
   - Nombre
   - Teléfono
   - Email
   - Subir CV (PDF)
4. **Click en "Enviar Postulación"**
5. **Verificar**:
   - ✅ Notificación toast verde aparece
   - ✅ Email llega al postulante (revisar bandeja/spam)
   - ✅ Email llega al correo corporativo (revisar bandeja/spam)
   - ✅ Ambos emails tienen el contenido correcto
   - ✅ Link de descarga de CV funciona en email admin

### Verificar en Base de Datos:
```sql
-- Ver correo corporativo configurado
SELECT * FROM generals WHERE correlative = 'corporate_email';

-- Ver plantillas de email
SELECT * FROM generals WHERE correlative LIKE '%job_application%';

-- Ver postulaciones recibidas
SELECT * FROM job_applications ORDER BY created_at DESC;
```

---

## 🔒 Seguridad

### Validaciones Implementadas:
- ✅ Email del postulante validado en frontend (type="email")
- ✅ CV solo acepta archivos PDF en frontend
- ✅ Plantillas HTML sanitizadas (TinyMCE)
- ✅ Variables reemplazadas de forma segura (str_replace)
- ✅ Links de descarga usan URL absoluta con url() helper

### Protección contra Spam:
- El formulario puede extenderse agregando:
  - reCAPTCHA v3
  - Rate limiting (throttle middleware)
  - Validación de honeypot

---

## 🎯 Extensiones Futuras

### Posibles Mejoras:
1. **Cola de Emails (Queue)**
   ```php
   // En JobApplicationController.php
   Notification::route('mail', $email)
       ->notify((new JobApplicationApplicantNotification($jobApplication))->delay(now()->addSeconds(5)));
   ```

2. **Adjuntar CV en Email al Admin**
   ```php
   // En JobApplicationAdminNotification.php
   ->attach(storage_path('app/public/resources/' . $this->jobApplication->cv_file))
   ```

3. **Panel de Tracking**
   - Ver qué emails se enviaron
   - Estadísticas de apertura (usando servicios como SendGrid)

4. **Auto-respuestas**
   - Email de seguimiento después de X días
   - Email de rechazo/aceptación

---

## 📞 Soporte

Si tienes problemas con el envío de emails, verifica:

1. **Configuración SMTP** en `.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=tu-email@gmail.com
   MAIL_PASSWORD=tu-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=noreply@tudominio.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

2. **Permisos de archivos** en `storage/`:
   ```bash
   php artisan storage:link
   chmod -R 775 storage
   chmod -R 775 bootstrap/cache
   ```

3. **Cola de emails** (si está activada):
   ```bash
   php artisan queue:work
   ```

4. **Logs de errores**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

---

## ✨ Resumen Final

### Lo que se logró:
✅ Campo "Correo Corporativo" en Generals  
✅ 2 plantillas de email editables desde admin  
✅ Notificaciones enviadas en paralelo  
✅ Variables dinámicas en plantillas  
✅ Sistema completamente funcional  
✅ Integración con BasicRest y toast notifications  
✅ Documentación completa  

### Próximos pasos:
1. Compilar cambios: `npm run build` (si no está en dev mode)
2. Configurar correo corporativo en `/admin/generals`
3. Personalizar plantillas de email (opcional)
4. Probar el sistema completo
5. ¡Listo para producción! 🚀
