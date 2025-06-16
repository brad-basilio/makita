<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ServicePoint extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'type',
        'name',
        'business_name',
        'address',
        'phones',
        'emails',
        'opening_hours',
        'location',
        'branches',
        'status',
        'visible'
    ];

    protected $casts = [
        'branches' => 'array',
        'status' => 'boolean',
        'visible' => 'boolean'
    ];

    // Scopes
    public function scopeDistributors($query)
    {
        return $query->where('type', 'distributor');
    }

    public function scopeServiceNetworks($query)
    {
        return $query->where('type', 'service_network');
    }

    public function scopeActive($query)
    {
        return $query->where('status', true)->where('visible', true);
    }

    // Accessors
    public function isDistributor(): bool
    {
        return $this->type === 'distributor';
    }

    public function isServiceNetwork(): bool
    {
        return $this->type === 'service_network';
    }

    // Helper method to get all locations (main + branches)
    public function getAllLocations(): array
    {
        $locations = [];
        
        // Main location
        $locations[] = [
            'name' => $this->name,
            'address' => $this->address,
            'phones' => $this->phones,
            'emails' => $this->emails,
            'opening_hours' => $this->opening_hours,
            'location' => $this->location,
            'is_main' => true
        ];

        // Branches
        if ($this->branches) {
            foreach ($this->branches as $branch) {
                $locations[] = array_merge($branch, ['is_main' => false]);
            }
        }

        return $locations;
    }
}
