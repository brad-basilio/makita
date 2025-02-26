import { Minus, Plus, PlusCircle, Trash2 } from "lucide-react";

const nuevoItem = ({ setCart, ...item }) => {

    const onDeleteClicked = () => {
        setCart(old => old.filter(x => x.id !== item.id));
    }

    const onPlusClicked = () => {
        setCart(old =>
            old.map(x =>
                x.id === item.id ? { ...x, quantity: (x.quantity || 1) + 1 } : x
            )
        );
    }

    const onMinusClicked = () => {
        setCart(old =>
            old.map(x => {
                if (x.id === item.id) {
                    const newQuantity = (x.quantity || 1) - 1;
                    if (newQuantity <= 0) {
                        onDeleteClicked(item.id);
                        return null;
                    }
                    return { ...x, quantity: newQuantity };
                }
                return x;
            }).filter(Boolean)
        );
    }
    console.log(item);
    return (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4">
                <img
                    src={`/api/items/media/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{item.name}</h3>

                    <p className="text-sm customtext-neutral-light">Marca: <span className="customtext-neutral-dark">{item.brand.name}</span></p>
                    <p className="text-sm customtext-neutral-light">Disponibilidad: <span className="customtext-neutral-dark">{item.stock >= item.quantity ? "En stock" : "Agotado"} </span></p>
                    <p className="text-sm customtext-neutral-light">SKU: <span className="customtext-neutral-dark">{item.sku}</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-36 text-right">
                        <div className="text-xs text-gray-500 line-through">S/ {Number(item.price * item.quantity).toFixed(2)}</div>
                        <div className="font-bold text-lg mt-2">S/ {Number(item.final_price * item.quantity).toFixed(2)}</div>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <button
                                    type="button"
                                    onClick={onMinusClicked}
                                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={16} />
                                </button>
                                <div className="w-12 h-8 flex justify-center items-center bg-white">
                                    <span className="font-semibold text-sm">{item.quantity || 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={onPlusClicked}
                                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                onClick={onDeleteClicked}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                aria-label="Remove item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>);
}

export default nuevoItem;