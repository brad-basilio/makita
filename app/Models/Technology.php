<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technology extends Model
{
   use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'description',
        'content',
        'banner',
        'image',
        'featured',
        'visible',
        'status',
    ];

       protected $casts = [
        'featured' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_technology');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'technology_id');
    }

}
