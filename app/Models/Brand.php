<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Brand extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'description',
        'image',
        'featured',
        'visible',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    /**
     * Por cada categoría, trae el producto destacado (featured=1),
     * o si no hay, el más reciente (mayor created_at).
     */

    public function featuredOrLatestItemsByCategory()
    {
        // Trae todos los items de la marca, ordenados por categoría y prioridad
        $items = $this->items()
            ->orderBy('category_id')
            ->orderByDesc('featured')
            ->orderByDesc('created_at')
            ->get();

        // Agrupa por categoría y toma el primero de cada grupo
        return $items->groupBy('category_id')->map->first();
    }
}
