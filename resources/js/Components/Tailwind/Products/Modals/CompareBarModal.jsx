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
        className={`w-full bg-[#262626EB]  shadow-lg px-2 sm:px-6 ${minimized ? 'py-2' : 'py-6'}`}
        style={{ margin: 0, pointerEvents: 'auto' }}
      >
        {/* Minimizada: solo botón para restaurar */}
        {minimized ? (
          <div className="flex justify-center items-center h-full">
            <button onClick={onRestore} className=" rounded text-3xl md:text-[32px]  p-2 text-white flex items-center gap-2 font-bold">
              <button onClick={onRestore} className="bg-primary rounded w-14 h-14 flex items-center justify-center text-white text-2xl">
                   <ChevronUp size={24} />
                </button>
            
              <span>Comparar productos</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <button onClick={onMinimize} className="bg-primary rounded w-14 h-14 flex items-center justify-center text-white text-2xl">
                  <ChevronDown size={32} />
                </button>
                <div>
                  <h2 className="text-3xl md:text-[32px] font-bold text-white">Comparar productos</h2>
                  <p className="text-base md:text-lg text-white">Puede añadir un máximo de cuatro artículos para comparar</p>
                </div>
              </div>
              <button
                className={`bg-primary text-white px-8 py-3 rounded text-lg font-bold transition-all ${products.length === 4 ? 'hover:bg-[#1786a1]' : 'opacity-50 cursor-not-allowed'}`}
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
                    className="mb-2 bg-primary rounded w-10 h-10 flex items-center justify-center text-white text-xl"
                    onClick={() => onRemove(product.id)}
                  >
                    <X size={20} />
                  </button>
                  <div className="bg-white rounded-lg p-4">
                    <img src={`/storage/images/item/${product.image}`} alt={product.name} className="h-24 object-cover aspect-square mb-2" />
                  </div>
                  <div className="text-white text-center font-bold mt-2 max-w-[180px]">
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
