<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aboutus extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'aboutuses';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'correlative',
        'name',
        'title',
        'description',
        'image',
        'timeline',
        'visible',
        'status'
    ];

    protected $casts = [
        'timeline' => 'array',
        'visible' => 'boolean',
        'status' => 'boolean'
    ];
}
