import Number2Currency from "../../../../Utils/Number2Currency";
import ButtonPrimary from "./ButtonPrimary";

export default function ConfirmationStep({ cart, code, delivery }) {


    const totalPrice = cart.reduce((acc, item) => {
        const finalPrice = item.final_price;
        return acc + finalPrice * item.quantity; // Sumar el precio total por cantidad
    }, 0);

    // Calcular el subtotal sin IGV (precio base)
    const subTotal = (totalPrice / 1.18).toFixed(2);

    // Calcular el IGV (18% del subtotal)
    const igv = (subTotal * 0.18).toFixed(2);




    // Calcular el total final (subtotal sin IGV + IGV + envío)
    const totalFinal = parseFloat(subTotal) + parseFloat(igv) + parseFloat(delivery);
    return (
        <div className="mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center space-y-4">
                    <h2 className="text-[20px] customtext-neutral-light">Gracias por tu compra 🎉</h2>
                    <p className="customtext-neutral-dark text-5xl font-semibold">Tu orden ha sido recibida</p>

                    <div className="py-4">
                        <div className=" customtext-neutral-light">Código de pedido</div>
                        <div className="customtext-neutral-dark text-lg font-semibold">{`#${code}`}</div>
                    </div>

                    <div className="space-y-4 max-w-lg bg-[#F7F9FB] mx-auto p-8 rounded-xl">
                        <div className="space-y-6 border-b-2 pb-6">
                            {cart.map((item, index) => (
                                <div key={index} className="rounded-lg">
                                    <div className="flex   gap-4">
                                        <div className="bg-white p-2 rounded-xl w-max">
                                            <img
                                                src={`/api/items/media/${item.image}`}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded  "
                                            />
                                        </div>
                                        <div className=" text-start">
                                            <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                                            <p className="text-sm customtext-neutral-light">Marca: <span className="customtext-neutral-dark">{item.brand.name}</span></p>
                                            <p className="text-sm customtext-neutral-light">Cantidad: <span className="customtext-neutral-dark">{item.quantity} </span></p>
                                            <p className="text-sm customtext-neutral-light">SKU: <span className="customtext-neutral-dark">{item.sku}</span></p>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex justify-between">
                                <span className="customtext-neutral-dark">Subtotal</span>
                                <span className="font-semibold">S/ {Number2Currency(subTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="customtext-neutral-dark">IGV</span>
                                <span className="font-semibold">S/ {Number2Currency(igv)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="customtext-neutral-dark">Envío</span>
                                <span className="font-semibold">S/ {Number2Currency(delivery)}</span>
                            </div>
                            <div className="py-3 border-y-2 mt-6">
                                <div className="flex justify-between font-bold text-[20px] items-center">
                                    <span>Total</span>
                                    <span>S/ {Number2Currency(totalFinal)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <ButtonPrimary href="/catalogo" >  Seguir Comprando</ButtonPrimary>

                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}

