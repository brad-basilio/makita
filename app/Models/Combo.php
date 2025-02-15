<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{

    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = ['name', 'visible', 'status'];

    // Relación con los items que pertenecen al combo
    public function items()
    {
        return $this->belongsToMany(Item::class, 'combo_items')
            ->withTimestamps();
    }
}
