<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSession extends Model
{
     use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'session_id',
        'device_type',
        'browser',
        'os',
        'country',
        'city',
        'referrer',
        'page_views',
        'duration',
        'converted'
    ];

    protected $casts = [
        'converted' => 'boolean',
        'page_views' => 'integer',
        'duration' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}