<?php

namespace App\Http\Controllers;

use App\Imports\ItemImport;
use App\Services\ItemImportService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ItemImportController extends Controller
{
    protected $importService;

    public function __construct(ItemImportService $importService)
    {
        $this->importService = $importService;
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls'
        ]);

        try {
            Excel::import(new ItemImport($this->importService), $request->file('file'));
            return response()->json(['message' => 'Importación exitosa']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al importar: ' . $e->getMessage()], 500);
        }
    }
}
