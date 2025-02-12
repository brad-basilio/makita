export default function ConfirmationStep({ products }) {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">Gracias por tu compra 🎉</h2>
                    <p className="text-gray-600">Tu orden ha sido recibida</p>

                    <div className="py-4">
                        <div className="text-sm text-gray-500">Código de pedido</div>
                        <div className="text-lg font-medium">#0123_45678</div>
                    </div>

                    <div className="space-y-4">
                        {products.map((product) => (
                            <div key={product.id} className="flex items-center gap-4">
                                <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 text-left">
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-gray-500">Cantidad: {product.quantity}</div>
                                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-6">
                        Seguir comprando
                    </button>
                </div>
            </div>
        </div>
    )
}

