<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'visible',
        'required',
        'order',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'required' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Relación con items
     */
    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_attribute')
            ->withPivot('value')
            ->withTimestamps();
    }

    /**
     * Obtener todos los valores únicos de este atributo
     */
    public function getUniqueValues()
    {
        return $this->items()
            ->select('item_attribute.value')
            ->distinct()
            ->pluck('value')
            ->sort()
            ->values();
    }
}
