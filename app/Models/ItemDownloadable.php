<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemDownloadable extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'item_id',
        'original_name',
        'url',
        'size',
        'mime_type',
        'order'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}