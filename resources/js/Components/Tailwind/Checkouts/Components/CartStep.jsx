export default function CartStep({ products, onContinue }) {
    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="space-y-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={`/api/items/media/${product.image}`}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                    <p className="text-sm">Disponibilidad: En stock</p>
                                    <p className="text-sm">Marca: Samsung</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select defaultValue="1" className="w-20 rounded-md border border-gray-300 p-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="p-2 text-gray-500 hover:text-red-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                    <div className="w-24 text-right">
                                        <div className="text-sm text-gray-500">S/ {Number(product.price).toFixed(2)}</div>
                                        <div className="font-medium">S/ {Number(product.price * product.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Resumen de compra</h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>S/ 1,344.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Envío</span>
                        <span>S/ 200.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">IGV</span>
                        <span>S/ 241.00</span>
                    </div>
                    <div className="pt-4 border-t">
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>S/ 1,785.00</span>
                        </div>
                    </div>
                    <div className="space-y-2 pt-4">
                        <button
                            onClick={onContinue}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Continuar
                        </button>
                        <button className="w-full border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

