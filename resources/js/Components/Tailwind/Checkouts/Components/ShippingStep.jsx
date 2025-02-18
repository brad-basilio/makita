import { processCulqiPayment } from "../../../../Functions/culqiPayment";

export default function ShippingStep({ onContinue }) {
    const handlePayment = async () => {
        try {
            const saleId = "ID_DE_LA_VENTA"; // Reemplázalo con el ID real de la venta
            const total = 150; // Total de la compra
            const email = "cliente@example.com"; // Email del cliente

            const result = await processCulqiPayment(saleId, total, email);
            alert("Pago exitoso: " + JSON.stringify(result));
        } catch (error) {
            alert("Error en el pago: " + error);
        }
    };
    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre completo</label>
                            <input
                                type="text"
                                placeholder="Nombre y Apellido"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="hola@mail.com"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Departamento</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="">Selecciona un Departamento</option>
                                    <option value="lima">Lima</option>
                                    <option value="arequipa">Arequipa</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Provincia</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="">Selecciona una Provincia</option>
                                    <option value="lima">Lima</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Distrito</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                                <option value="">Selecciona un Distrito</option>
                                <option value="miraflores">Miraflores</option>
                                <option value="san-isidro">San Isidro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Avenida / Calle / Jirón</label>
                            <input
                                type="text"
                                placeholder="Ingresa el nombre de la calle"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Número</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa el número de la calle"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Dpto./ Interior/ Piso/ Lote/ Bloque</label>
                                <input
                                    type="text"
                                    placeholder="Ejem. Casa 3, Dpto 101"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Referencia</label>
                            <input
                                type="text"
                                placeholder="Ejem. Altura de la avenida..."
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <input type="radio" id="free" name="shipping" className="w-4 h-4 text-blue-600" />
                                <label htmlFor="free">
                                    <div>Envío gratis</div>
                                    <div className="text-sm text-gray-500">Entrega entre 3 a 10 días hábiles</div>
                                </label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input type="radio" id="delivery" name="shipping" className="w-4 h-4 text-blue-600" defaultChecked />
                                <label htmlFor="delivery">
                                    <div>Delivery</div>
                                    <div className="text-sm text-gray-500">Delivery 24 horas</div>
                                </label>
                            </div>
                        </div>
                    </form>
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
                            Pagar compra
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

