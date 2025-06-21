<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JobApplicationController extends BasicController
{
    public $model = JobApplication::class;
    public $reactView = 'Admin/JobApplications';
    public $imageFields = ['cv_file'];

 

    public function beforeSave(Request $request)
    {
        $data = $request->all();
        
        // Si se está marcando como visto
        if (isset($data['seen']) && $data['seen'] && !isset($data['reviewed_at'])) {
            $data['reviewed_at'] = Carbon::now();
        }

        return $data;
    }
}
