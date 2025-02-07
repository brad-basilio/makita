//rsc
import React from 'react';

const CardHoverBtn = ({ product }) => {
    return (
        <div
            key={product.id}
            className="group w-full min-w-[200px] px-2 sm:w-1/3 lg:w-1/5 flex-shrink-0 font-font-secondary"
        >
            <div
                className="bg-white rounded-2xl shadow-md p-4"
                style={{ boxShadow: "0px 0px 6px 0px #00000040" }}
            >
                {/* Product image and discount badge */}
                <div className="relative mb-4">
                    {product.discount != null && !isNaN(product.discount) && (
                        <span className="absolute top-2 left-2 bg-[#F93232] text-white text-base font-medium px-2 py-1 rounded-full">
                            -{Number(100 - (product.discount * 100 / product.price)).toFixed(0)}%
                        </span>
                    )}
                    <div className="aspect-square rounded-lg overflow-hidden  flex items-center justify-center p-4">
                        <img
                            src={`/api/items/media/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
                {/* Action buttons (hidden by default, shown on hover) */}
                <div className="my-4 gap-2  hidden group-hover:flex  transition-all  duration-500">
                    <button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg  transition-colors">
                        Ver detalle
                    </button>
                    <button className="p-2 border border-primary rounded-lg customtext-primary transition-colors">
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </button>
                </div>

                {/* Product info */}
                <div>
                    <p className="text-xs customtext-neutral-light font-semibold mb-1">
                        {product.brand.name}
                    </p>
                    <h3 className="customtext-neutral-dark text-sm font-semibold mb-2 line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex flex-col items-baseline gap-2 mb-4">
                        {product.discount != null && !isNaN(product.discount) && (
                            <span className="text-xs customtext-neutral-light font-semibold1 line-through">
                                S/ {product.price}
                            </span>
                        )}
                        <span className="customtext-neutral-dark text-2xl font-bold">
                            S/ {product.final_price}
                        </span>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default CardHoverBtn;