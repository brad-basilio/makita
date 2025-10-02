<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemAttribute extends Model
{
    use HasFactory;

    protected $table = 'item_attribute';

    protected $fillable = [
        'item_id',
        'attribute_id',
        'value',
    ];

    /**
     * Relación con Item
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Relación con Attribute
     */
    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }
}
