// Nuevo Card para replicar la UI de la imagen
import React, { useState } from 'react';
import { Eye, BarChart2 } from 'lucide-react';


const CardProductMakita = ({ product, data, widthClass, cart, setCart, viewType = 'grid', onCompareClick }) => {
    const [isHovering, setIsHovering] = useState(false);

    if (!product) {
        return null;
    }

    // Si es vista de lista, usamos una estructura horizontal
    if (viewType === 'list') {
        return (<div
            className="bg-transparent w-full rounded-xl shadow-sm flex flex-row h-auto transition-all duration-200 hover:shadow-2xl overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Imagen - Para vista lista */}
            <div className="relative bg-white flex justify-center items-center  w-1/4 min-w-[120px] max-w-[180px] p-2">                   
             {product.is_new === 1 && (
                <span className="absolute top-2 right-2 md:top-2 md:right-2 bg-primary max-w-max text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
                    NUEVO
                </span>
            )}
                <img
                    src={`/storage/images/item/${product.image}`}
                    onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                    alt={product.name}
                    className="object-contain h-48 md:h-28 max-w-full mx-auto"
                    loading='lazy'
                />
            </div>
            {/* Contenido de texto - Para vista lista */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Código del producto */}
                <div className="text-primary text-sm font-medium mb-1">
                    {product.code || "DMR200"}
                </div>
                {/* Título */}
                <h3 className="customtext-neutral-dark font-bold text-lg mb-2 leading-tight line-clamp-2">
                    {product.name || product.title}
                </h3>
                {/* Descripción */}
                <p className="customtext-neutral-light text-sm mb-3 line-clamp-2 lg:line-clamp-3 " dangerouslySetInnerHTML={{ __html: product.description }}>
                </p>

                {/* Botones en el lado derecho - Con efecto hover en desktop */}
                <div className={`mt-auto pt-3 ${isHovering ? 'lg:opacity-100' : 'lg:opacity-0'} opacity-100 transition-opacity duration-300`}>
                    <div className="flex flex-wrap gap-2 justify-start">
                        <button
                            className="flex-1 md:flex-none bg-white border border-primary customtext-primary py-2 px-3 rounded-sm flex items-center justify-center gap-1 hover:bg-primary-dark hover:text-white transition-colors"
                            onClick={onCompareClick}
                        >
                            <span className="font-medium text-sm">Comparar</span>
                        </button>
                        <a
                            href={`/producto/${product.slug}`}
                            className="flex-1 md:flex-none w-24 bg-primary text-white border border-primary py-2 px-3 rounded-sm flex items-center justify-center gap-1 hover:bg-primary-dark transition-colors"
                        >
                            <span className="font-medium text-sm">Ver</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    // Vista de grilla (grid)
    return (
        <div
            className="bg-transparent w-full rounded-xl shadow-sm flex flex-col h-full transition-all duration-200 hover:shadow-lg overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Imagen - Para vista grid */}
            <div className="relative bg-white flex justify-center items-center lg:h-52 p-2 lg:p-4">
                {product && product.is_new === 1 && (
                    <span className="absolute top-8 right-0 bg-primary text-white text-sm font-bold px-2 py-1 rounded-sm">
                        NUEVO
                    </span>
                )}
                <img
                    src={product && product.image ? `/storage/images/item/${product.image}` : '/assets/img/noimage/no_img.jpg'}
                    onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                    alt={product && product.name ? product.name : ''}
                    className="object-contain max-h-48 max-w-full"
                    loading='lazy'
                />
            </div>

            {/* Contenido de texto - Para vista grid */}
            <div className="p-2 lg:p-5 flex flex-col flex-grow">
                {/* Código del producto */}
                <div className="text-primary text-sm font-medium mb-1">
                    {product.code || "DMR200"}
                </div>
                {/* Título */}
                <h3 className="customtext-neutral-dark font-bold text-lg mb-2 leading-tight line-clamp-2">
                    {product.name || product.title}
                </h3>
                {/* Descripción */}
                <p className="customtext-neutral-light text-sm mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description }}>
                </p>

                {/* Botones en el footer - Siempre visibles en móvil, visibles en hover en desktop */}
                <div className={`mt-auto pt-3 ${isHovering ? 'lg:opacity-100' : 'lg:opacity-0'} opacity-100 transition-opacity duration-300`}>
                    <div className="flex flex-col lg:flex-row gap-2 w-full">
                        <button
                            className="flex-1 bg-white border border-primary customtext-primary py-2 px-3 rounded-sm flex items-center justify-center gap-1 hover:bg-primary-dark transition-colors"
                            onClick={onCompareClick}
                        >
                            <span className="font-medium text-sm">Comparar</span>
                        </button>
                        <a
                            href={`/producto/${product.slug}`}
                            className="flex-1 bg-primary text-white border border-primary py-2 px-3 rounded-sm flex items-center justify-center gap-1 hover:bg-primary transition-colors"
                        >
                            <span className="font-medium text-sm">Ver</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardProductMakita;