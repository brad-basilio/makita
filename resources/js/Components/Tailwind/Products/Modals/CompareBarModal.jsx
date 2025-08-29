import React, { useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const CompareBarModal = ({ open, minimized, products, onRemove, onCompare, onMinimize, onRestore }) => {
  // Solo mostrar si hay al menos un producto
  if (!products || products.length === 0) return null;

  // Evitar que la barra cause scroll/jump en el body
  const barRef = useRef(null);
  useEffect(() => {
    // No tocar el body, solo asegurarse que la barra esté fixed y no cambie el layout
    if (barRef.current) {
      barRef.current.style.pointerEvents = 'auto';
    }
  }, [products.length, minimized]);

  return (
    <div ref={barRef} className="fixed left-0 right-0 bottom-0 z-50 w-full" style={{ pointerEvents: 'none' }}>
      <div
        className={`w-full bg-[#262626EB]  shadow-lg px-2 sm:px-6 ${minimized ? 'py-2' : 'py-20'}`}
        style={{ margin: 0, pointerEvents: 'auto' }}
      >
        {/* Minimizada: solo botón para restaurar */}
        {minimized ? (
          <div className="flex justify-center items-center h-full">
            <button onClick={onRestore} className=" rounded text-3xl md:text-[30px]  p-2 text-white flex items-center gap-6 ">
              <button onClick={onRestore} className="bg-primary rounded w-14 h-14 flex items-center justify-center text-white text-2xl hover:bg-[#219FB9] transition-all duration-300">
                   <ChevronUp size={24} />
                </button>
            
              <span>Comparar productos</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-8">
                <button onClick={onMinimize} className="bg-primary rounded w-14 h-14 flex items-center justify-center text-white text-2xl hover:bg-[#219FB9] transition-all duration-300">
                  <ChevronDown size={24} />
                </button>
                <div>
                  <h2 className="text-3xl md:text-[32px] font-medium text-white">Comparar productos</h2>
                  <p className="text-base md:text-base text-white">Puede añadir un máximo de cuatro artículos para comparar</p>
                </div>
              </div>
              <button
                className={`bg-[#219FB9] text-white px-4 py-3 rounded-md text-lg tracking-wider transition-all ${products.length === 4 ? 'hover:bg-[#1786a1]' : 'opacity-50 cursor-not-allowed'}`}
                disabled={products.length !== 4}
                onClick={() => {
                  onCompare();
                  onMinimize && onMinimize();
                }}
              >
                Comparar
              </button>
            </div>
            <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col items-center">
                  <button
                    className="mt-2 mb-4 bg-primary rounded w-9 h-9 flex items-center justify-center text-white text-xl hover:bg-[#219FB9] transition-all duration-300"
                    onClick={() => onRemove(product.id)}
                  >
                    <X size={16} />
                  </button>
                  <div className="bg-white rounded-lg p-2 aspect-square">
                    <img src={`/storage/images/item/${product.image}`} alt={product.name} className="h-28 object-cover aspect-square mb-2" />
                  </div>
                  <div className="text-white text-center line-clamp-3  mt-2 max-w-[180px]">
                    {product.name}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompareBarModal;
