<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class DeliveryPrice extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'price',
        'ubigeo',
    ];

    protected $appends = [
        'data'
    ];

    protected function getDataAttribute()
    {
        $ubigeo = collect(JSON::parse(File::get(storage_path('app/utils/ubigeo.json'))));
        $filtered = $ubigeo->filter(function ($item) {
            if (!isset($item['reniec'])) return false;
            return $item['reniec'] == $this->ubigeo;
        })->first();
        
        return $filtered ?? null;
    }
}
