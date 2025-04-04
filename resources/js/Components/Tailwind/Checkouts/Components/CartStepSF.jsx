import { useState } from "react";
import Number2Currency from "../../../../Utils/Number2Currency";

import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import CardItemSF from "./CardItemSF";




export default function CartStepSF({ cart, setCart, onContinue, subTotal, envio, igv, totalFinal }) {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8 md:gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-3 flex flex-row w-full">
                {/* Versión desktop (tabla) */}
                <div className="hidden md:block overflow-x-auto rounded-lg w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="!font-font-general">
                                <th scope="col" className="px-6 py-3 text-left text-sm 2xl:text-base font-semibold customtext-neutral-dark">
                                    Producto
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-sm 2xl:text-base font-semibold customtext-neutral-dark">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-sm 2xl:text-base font-semibold customtext-neutral-dark">
                                    Precio
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-sm 2xl:text-base font-semibold customtext-neutral-dark">
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cart.map((item, index) => (
                                <CardItemSF key={index} {...item} setCart={setCart} />
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* Versión mobile (tarjetas) - Se muestra automáticamente en móviles */}
                <div className="md:hidden space-y-4 w-full">
                    {cart.map((item, index) => (
                            <CardItemSF key={index} {...item} setCart={setCart} />
                    ))}
                </div>
            </div>

            {/* Resumen de compra */}
            <div className="bg-[#F7F9FB] rounded-xl shadow-lg p-6 col-span-2 h-max font-font-general">
                <h3 className="text-2xl font-bold pb-6 customtext-neutral-dark">Resumen de compra</h3>
                <div className="space-y-4">
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
                        <span className="font-semibold">S/ {Number2Currency(envio)}</span>
                    </div>
                    <div className="py-3 border-y-2 mt-6">
                        <div className="flex justify-between font-bold text-[20px] items-center">
                            <span>Total</span>
                            <span>S/ {Number2Currency(totalFinal)}</span>
                        </div>
                    </div>
                    <div className="space-y-2 pt-4">

                        <ButtonPrimary className={'rounded-2xl xl:rounded-3xl'} onClick={onContinue}>  Continuar</ButtonPrimary>

                        <ButtonSecondary className={'rounded-2xl xl:rounded-3xl'} href="/"> Cancelar</ButtonSecondary>
                    </div>
                    <div>
                        <p className="text-sm customtext-neutral-dark">
                            Al realizar tu pedido, aceptas los <a className="customtext-primary font-bold">Términos y Condiciones</a>, y que nosotros usaremos sus datos personales de acuerdo con nuestra <a className="customtext-primary font-bold">Política de Privacidad</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}