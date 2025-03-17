<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\General;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;

class ComplaintController extends BasicController
{
    public $model = Complaint::class;
    public $reactView = 'Complaint';
    public $reactRootView = 'public';

    public function saveComplaint(Request $request)
    {
        //dump($request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'dni' => 'nullable|string|max:20',
            'type' => 'required|in:queja,sugerencia,reclamo técnico',
            'incident_date' => 'nullable|date',
            'order_number' => 'nullable|string|max:50',
            'priority' => 'required|in:baja,media,alta',
            'description' => 'required|string',
            'files.*' => 'nullable|file',
        ]);

        $filePaths = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $full = $file;
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/complaint/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $filePaths[] = "{$uuid}.{$ext}";
            }
        }
        //dump($filePaths);
        $complaint = Complaint::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'dni' => $request->dni,
            'type' => $request->type,
            'incident_date' => $request->incident_date,
            'order_number' => $request->order_number,
            'priority' => $request->priority,
            'description' => $request->description,
            'file_paths' => $filePaths,
        ]);
        //dump(DB::getQueryLog());

        //dump($complaint);

        return response()->json(['message' => 'Reclamo registrado con éxito', 'data' => $complaint], 201);
    }
}
