<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'sale_id',
        'item_id',
        'name',
        'price',
        'quantity',
        'image'
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
