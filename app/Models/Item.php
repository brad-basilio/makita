<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'summary',
        'description',
        'price',
        'discount',
        'final_price',
        'discount_percent',
        'banner',
        'image',
        'category_id',
        'subcategory_id',
        'brand_id',
        'is_new',
        'offering',
        'recommended',
        'featured',
        'visible',
        'status',
        'sku',
        'stock',

    ];

    static function getForeign(Builder $builder, string $model, $relation)
    {
        $table = (new $model)->getTable();
        return $builder->reorder()
            ->join($table, $table . '.id', '=', 'items.' . $relation)
            ->select($table . '.*')
            ->distinct()
            ->orderBy($table . '.name', 'ASC')
            ->get()
            ->map(function ($item) use ($model) {
                $jpa = new $model((array) $item->toArray());
                $jpa->id = $item->id;
                return $jpa;
            });
    }

    static function getForeignMany(Builder $builder, string $through, string $model)
    {
        $table = (new $model)->getTable();
        $tableThrough = (new $through)->getTable();
        return $builder->reorder()
            ->join($tableThrough, $tableThrough . '.item_id', '=', 'items.id')
            ->join($table, $table . '.id', $tableThrough . '.tag_id')
            ->select($table . '.*')
            ->distinct()
            ->orderBy($table . '.name', 'ASC')
            ->get()
            ->map(function ($item) use ($model) {
                $jpa = new $model((array) $item->toArray());
                $jpa->id = $item->id;
                return $jpa;
            });
    }

    public function category()
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function subcategory()
    {
        return $this->hasOne(SubCategory::class, 'id', 'subcategory_id');
    }

    public function brand()
    {
        return $this->hasOne(Brand::class, 'id', 'brand_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'item_tags', 'item_id', 'tag_id');
    }

    public function combos()
    {

        return $this->belongsToMany(Combo::class, 'combo_items')->withPivot('is_main_item');
    }

    public function images()
    {
        return $this->hasMany(ItemImage::class);
    }

    public function specifications()
    {
        return $this->hasMany(ItemSpecification::class);
    }

    public function features()
    {
        return $this->hasMany(ItemFeature::class);
    }

    protected static function booted()
    {
        static::creating(function ($item) {
            if (empty($item->sku)) {
                $item->sku = 'PROD-' . strtoupper(substr($item->categoria_id, 0, 3)) . '-' . strtoupper(substr($item->name, 0, 3)) . '-' . uniqid();
            }
        });
    }
}
