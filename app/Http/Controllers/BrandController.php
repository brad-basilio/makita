<?php

    namespace App\Http\Controllers;

    use App\Models\Brand;
    use App\Http\Requests\StoreBrandRequest;
    use App\Http\Requests\UpdateBrandRequest;

    class BrandController extends BasicController
    {
        /**
         * Devuelve el producto destacado o más reciente de una marca.
      
         */
        public function featuredItemByCategory($brandId, \Illuminate\Http\Request $request)
        {
            $query = \App\Models\Item::where('brand_id', $brandId);
         
            // Producto destacado o más reciente
            $item = $query->orderByDesc('featured')
                ->orderByDesc('created_at')
                ->first();

            return response()->json([
                'item' => $item
            ]);
        }
    }
