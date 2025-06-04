import React, { useState } from 'react';
import { X } from 'lucide-react';

const CompareModal = ({ isOpen, onClose, products, onCompare }) => {
  const [selected, setSelected] = useState([]);

  const toggleProduct = (product) => {
    if (selected.find((p) => p.id === product.id)) {
      setSelected(selected.filter((p) => p.id !== product.id));
    } else if (selected.length < 4) {
      setSelected([...selected, product]);
    }
  };

  const isSelected = (product) => selected.some((p) => p.id === product.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#262626] rounded-lg w-full max-w-5xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white"><X size={28} /></button>
        <h2 className="text-4xl font-bold text-white text-center mb-2">Comparar productos</h2>
        <p className="text-lg text-white text-center mb-8">Puede añadir un máximo de cuatro artículos para comparar</p>
        <div className="flex justify-center gap-8 mb-8 flex-wrap">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              <button
                className="mb-2 bg-[#1CA6C9] rounded w-10 h-10 flex items-center justify-center text-white text-xl"
                onClick={() => toggleProduct(product)}
                disabled={!isSelected(product) && selected.length >= 4}
              >
                {isSelected(product) ? <X size={20} /> : <span>+</span>}
              </button>
              <div className="bg-white rounded-lg p-4">
                <img src={`/storage/images/item/${product.image}`} alt={product.name} className="h-32 object-contain mb-2" />
              </div>
              <div className="text-white text-center font-bold mt-2">
                {product.name}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className={`bg-[#1CA6C9] text-white px-8 py-3 rounded text-lg font-bold transition-all ${selected.length === 4 ? 'hover:bg-[#1786a1]' : 'opacity-50 cursor-not-allowed'}`}
            disabled={selected.length !== 4}
            onClick={() => onCompare(selected)}
          >
            Comparar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
