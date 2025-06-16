<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ServicePoint;
use Illuminate\Http\Request;

class ServicePointController extends BasicController
{
    public $model = ServicePoint::class;
    public $reactView = 'Admin/ServicePoints';

    public function beforeSave(Request $request)
    {
        $data = $request->all();
        
        // Parse branches JSON if provided
        if (isset($data['branches']) && !empty($data['branches'])) {
            if (is_string($data['branches'])) {
                $data['branches'] = json_decode($data['branches'], true);
            }
        } else {
            $data['branches'] = null;
        }
        
        return $data;
    }

    public function publicIndex()
    {
        $servicePoints = ServicePoint::where('status', true)
            ->where('visible', true)
            ->orderBy('type')
            ->orderBy('name')
            ->get();
            
        return response()->json($servicePoints);
    }
}
