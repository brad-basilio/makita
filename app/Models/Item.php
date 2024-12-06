<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'category_id',
        'name',
        'summary',
        'description',
        'sessions',
        'type',
        'certificate',
        'session_duration',
        'long_duration',
        'price',
        'discount',
        'students',
        'image',
        'audience',
        'requirements',
        'objectives',
        'content',
        'featured',
        'visible',
        'status',
    ];

    public function category()
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }
}
