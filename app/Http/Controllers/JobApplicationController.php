<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use SoDe\Extend\Response;

class JobApplicationController extends BasicController
{
    public $model = JobApplication::class;
    public $reactView = 'Admin/JobApplications';
    public $imageFields = ['cv_file'];

}
