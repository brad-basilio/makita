import React from 'react';
import { ShoppingCart } from 'lucide-react'; // Icono para la cesta
import Swal from 'sweetalert2';
import ItemsRest from "../../../../Actions/ItemsRest";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const ProductCardColors = ({ product, setCart, cart }) => {
    
    const itemsRest = new ItemsRest();
    const [variationsItems, setVariationsItems] = useState([]);

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart)
        const index = newCart.findIndex(x => x.id == product.id)
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 })
        } else {
            newCart[index].quantity++
        }
        setCart(newCart)

        Swal.fire({
            title: 'Producto agregado',
            text: `Se agregó ${product.name} al carrito`,
            icon: 'success',
            timer: 1500,
        })
    }

    const handleVariations = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                slug: item?.slug,
                limit: 5,
            };
            
            const response = await itemsRest.getVariations(request);

            if (!response) {
                return;
            }

            const variations = response;
            
            setVariationsItems(variations.variants);
            
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (product?.id) {
            handleVariations(product);
        }
    }, [product]);

    const inCart = cart?.find(x => x.id == product?.id)
    const finalPrice = product?.discount > 0 ? product?.discount : product?.price
    return (
        <div
            key={product.id}
            className={`group w-full transition-transform duration-300 hover:scale-105 flex-shrink-0 font-font-general customtext-primary cursor-pointer`}
        >   <a href={`/item/${product.slug}`}>
            <div
                className="bg-white p-0 sm:p-4"

            >
                {/* Imagen del producto y etiqueta de descuento */}
                <div className="relative">
                    {product.discount != null && !isNaN(product.discount) && (
                        <span className="absolute top-8 right-0 bg-[#F93232] text-white text-base font-bold px-2 py-1 rounded-l-full">
                            -{Math.abs(Number(100 - Number((product?.discount * 100 / product?.price)))).toFixed(0)}%
                        </span>
                    )}
                    <div className="aspect-square rounded-3xl overflow-hidden flex items-center justify-center  bg-secondary">
                        <img
                            src={`/storage/images/item/${product.image}`}
                            onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading='lazy'
                        />
                    </div>
                </div>

                {/* Información del producto */}
                <div className='py-4'>
                    <p className="text-sm sm:text-base font-bold mb-1">
                        {product.category.name}
                    </p>
                    <div className="flex gap-3 items-center justify-start w-full flex-wrap">
                        {variationsItems.map((variant) => (
                            <Tippy content={variant.color}>
                                <a
                                    key={variant.slug}
                                    href={`/item/${variant.slug}`}
                                    className="variant-option  rounded-full object-fit-cover "
                                >
                                    <img
                                        className="color-box rounded-full h-9 w-9 object-fit-cover "
                                        src={`/storage/images/item/${variant.texture || variant.image}`}
                                    />
                                </a>
                            </Tippy>
                        ))}
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                    {/* Precio */}
                    <div className="flex items-baseline gap-4 mt-4">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold">
                            S/ {product.final_price}
                        </span>
                        {product.discount != null && !isNaN(product.discount) && (
                            <span className="text-xs sm:text-base font-bold line-through opacity-60">
                                S/ {product.price}
                            </span>
                        )}

                    </div>
                </div>
            </div >
            </a>
        </div >
    );
};

export default ProductCardColors;
