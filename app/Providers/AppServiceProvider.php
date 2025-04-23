<?php

namespace App\Providers;

use App\Models\Item;
use App\Models\Sale;
use App\Observers\ItemPriceObserver;
use App\Observers\SaleCreationObserver;
use App\Observers\SaleStatusObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Item::observe(ItemPriceObserver::class);
        Sale::observe([
            SaleCreationObserver::class,
            SaleStatusObserver::class,
        ]);
    }
}
