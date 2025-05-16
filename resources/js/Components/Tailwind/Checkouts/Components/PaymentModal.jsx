"use client";

import { useState, useEffect } from "react";
import ReactModal from "react-modal";

export default function PaymentModal({ isOpen, onClose, onPaymentComplete }) {
    
    const [paymentMethod, setPaymentMethod] = useState("tarjeta");
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
        if (paymentMethod === "tarjeta" && isOpen) {
            handlePayment();
        }
    }, [paymentMethod, isOpen]);


    const handlePayment = () => {
        setSaving(true);
        // Simular procesamiento de pago
        onPaymentComplete();
        setTimeout(() => {
            setSaving(false);
            onClose();
        }, 1000);
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Imagen decorativa - lado izquierdo */}
                <div className="hidden md:block bg-[#f8f5f2] h-full">
                    <img
                        src="/assets/img/salafabulosa/portadapagos.png"
                        alt="Métodos de pago"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Contenido del modal - lado derecho */}
                <div className="p-6 max-h-[90vh] md:max-h-[100vh] flex flex-col justify-center ">
                    <div className="mb-0 md:mb-4">
                        <h2 className="text-xl md:text-2xl 2xl:text-3xl font-bold text-primary">
                            ¿Cómo deseas pagar tu pedido?
                        </h2>
                        <p className="text-primary mt-2 text-sm 2xl:text-base">
                            Elige una de las opciones disponibles para
                            completar tu pago de forma segura.
                        </p>
                    </div>

                    <div className="mt-3 space-y-3">
                        {/* Opción Tarjeta */}
                        <div
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                paymentMethod === "tarjeta"
                                    ? "border-primary bg-[#f8f5f2]"
                                    : "border-gray-200 hover:border-2 hover:border-[#3a2723]"
                            }`}
                            onClick={() => setPaymentMethod("tarjeta")}
                        >
                            <div className="flex flex-row items-center justify-between gap-2">
                                <div className="flex flex-col items-start justify-center space-x-2">
                                    <input
                                        type="radio"
                                        id="tarjeta"
                                        name="paymentMethod"
                                        checked={paymentMethod === "tarjeta"}
                                        onChange={() => setPaymentMethod("tarjeta")}
                                        className="h-5 w-5 text-primary focus:ring-primary hidden"
                                    />
                                    <label
                                        htmlFor="tarjeta"
                                        className="font-medium text-base 2xl:text-lg"
                                    >
                                        Pago con Tarjeta
                                    </label>
                                    <p className="text-[#5c504c] text-sm 2xl:text-base ml-7 mt-1">
                                        Renueva tus espacios con estilo: Fundas exclusivas para cada temporada.
                                    </p>
                                </div>
                                <div className="min-w-5 flex items-center justify-center">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                        paymentMethod === "tarjeta" 
                                            ? "bg-[#3a2723]" 
                                            : "border-2 border-[#d0ccca]"
                                    }`}>
                                        <div className={`h-2 w-2 rounded-full ${
                                            paymentMethod === "tarjeta" ? "bg-white" : ""
                                        }`}></div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>

                        {/* Opción Yape/Plin */}
                        <div
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                paymentMethod === "yape"
                                    ? "border-primary bg-[#f8f5f2]"
                                    : "border-gray-200 hover:border-2 hover:border-[#3a2723]"
                            }`}
                            onClick={() => setPaymentMethod("yape")}
                        >
                            <div className="flex flex-row items-center justify-between gap-2">
                                <div className="flex flex-col items-start justify-center space-x-2">
                                    <input
                                        type="radio"
                                        id="yape"
                                        name="paymentMethod"
                                        checked={paymentMethod === "yape"}
                                        onChange={() => setPaymentMethod("yape")}
                                        className="h-5 w-5 text-primary focus:ring-[#3a2723] hidden"
                                    />
                                    <label
                                        htmlFor="yape"
                                        className="font-medium text-base 2xl:text-lg"
                                    >
                                        Yape / Plin
                                    </label>
                                    <p className="text-[#5c504c] text-sm 2xl:text-base ml-7 mt-1">
                                        Realiza el pago desde tu celular sin comisiones.
                                    </p>
                                </div>
                                <div className="min-w-5 flex items-center justify-center">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                        paymentMethod === "yape" 
                                            ? "bg-[#3a2723]" 
                                            : "border-2 border-[#d0ccca]"
                                    }`}>
                                        <div className={`h-2 w-2 rounded-full ${
                                            paymentMethod === "yape" ? "bg-white" : ""
                                        }`}></div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>

                        {/* Opción Transferencia */}
                        <div
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                paymentMethod === "transferencia"
                                    ? "border-primary bg-[#f8f5f2]"
                                    : "border-gray-200 hover:border-2 hover:border-[#3a2723]"
                            }`}
                            onClick={() => setPaymentMethod("transferencia")}
                        >
                            <div className="flex flex-row items-center justify-between gap-2">
                                <div className="flex flex-col items-start justify-center space-x-2">
                                    <input
                                        type="radio"
                                        id="transferencia"
                                        name="paymentMethod"
                                        checked={paymentMethod === "transferencia"}
                                        onChange={() => setPaymentMethod("transferencia")}
                                        className="h-5 w-5 text-primary focus:ring-[#3a2723] hidden"
                                    />
                                    <label
                                        htmlFor="transferencia"
                                        className="font-medium text-base 2xl:text-lg"
                                    >
                                        Pago por Transferencia
                                    </label>
                                    <p className="text-[#5c504c] text-sm 2xl:text-base ml-7 mt-1">
                                        Haz una transferencia bancaria desde tu app o banca por internet.
                                    </p>
                                </div>
                                <div className="min-w-5 flex items-center justify-center">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                        paymentMethod === "transferencia" 
                                            ? "bg-[#3a2723]" 
                                            : "border-2 border-[#d0ccca]"
                                    }`}>
                                        <div className={`h-2 w-2 rounded-full ${
                                            paymentMethod === "transferencia" ? "bg-white" : ""
                                        }`}></div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <button
                            className={`w-full bg-[#3a2723] hover:bg-[#2a1d1a] text-white py-3 rounded-3xl text-base 2xl:text-lg leading-normal font-medium transition-colors ${
                                saving ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            onClick={handlePayment}
                            disabled={saving}
                        >
                            {saving ? "Procesando..." : "Pagar ahora"}
                        </button>
                        <button
                            className="w-full border border-[#3a2723] text-[#3a2723] hover:bg-[#f8f5f2] py-3 text-base 2xl:text-lg leading-normal rounded-3xl font-medium transition-colors"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}