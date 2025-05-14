<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'user_id',
        'name',
        'lastname',
        'fullname',
        'email',
        'phone',
        'phone_prefix',
        'country',
        'department',
        'province',
        'district',
        'ubigeo',
        'address',
        'number',
        'reference',
        'comment',
        'amount',
        'delivery',
        'delivery_type',
        'status_id',
        'culqi_charge_id',
        'payment_status',
        'invoiceType',
        'documentType',
        'document',
        'businessName',
        'payment_method',
        'payment_proof'
    ];

    public function details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function status()
    {
        return $this->belongsTo(SaleStatus::class);
    }
}
