<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use App\Models\SaleStatus;
use Illuminate\Http\Request;

class SaleController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Admin/Sales';
    public $with4get = ['status', 'details'];

    public function setReactViewProperties(Request $request)
    {
        return [
            'statuses' => SaleStatus::all(),
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with('status');
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        $saleJpa = Sale::with($this->with4get)->find($jpa->id);
        return $saleJpa;
    }
}
